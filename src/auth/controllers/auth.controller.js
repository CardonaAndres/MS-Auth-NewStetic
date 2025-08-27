import ActiveDirectory from "activedirectory2";
import { JWT } from '../libs/jwt/JWT.js'
import { AllowedUsers } from '../utils/defineAllowedUsers.js';

export class AuthController {
    static async login(req, res, next) {
        try {
            const { username, password, appName } = req.body;
            const usernamesAllowed = AllowedUsers.defineAllowedUsers(appName);

            if(!username || !password) {
                const err = new Error('❌ Usuario y contraseña son requeridos');
                err.status = 400;
                throw err;
            }

            if(!usernamesAllowed.includes(username)){
                const err = new Error('Usuario no valido para este aplicativo');
                err.status = 400;
                throw err;
            }

            const userConfig = { 
                url: 'ldap://' + process.env.LDAP_SERVER,
                baseDN: process.env.LDAP_BASE_DN,
                username: `${username}@${process.env.LDAP_DOMAIN}`, 
                password 
            };

            const ad = new ActiveDirectory(userConfig);

                ad.authenticate(userConfig.username, password, (err, auth) => {
                    if (err) {
                        let msg = '❌ Error de autenticación. Intente nuevamente o comuníquese con la mesa de ayuda.';
                        if (err.message) {
                            if (err.message.includes('775')) 
                                msg = '❌ Usuario bloqueado. Comuníquese con la mesa de ayuda.'

                            if (err.message.includes('52e')) msg = '❌ Usuario o contraseña incorrectos';
                            
                            if (err.message.includes('532')) msg = '❌ La contraseña ha expirado. Debe cambiarla.';  
                        }

                        return res.status(401).json({ message: msg });
                    }

                    if(!auth) return res.status(401).json({ message: '❌ Usuario o contraseña incorrectos' })

                    ad.findUser({ attributes: ["*"] }, username, (err, user) => {
                        if (err || !user) 
                            return res.status(401).json({ message: '❌ Usuario o contraseña incorrectos' });
                    
                        const userInfo = {
                            displayName: user.displayName || username,
                            username: username,
                            department: user.department,
                            cn: user.cn || '',
                            sn: user.sn || '',
                            givenName: user.givenName || '',
                            mail: user.userPrincipalName || '',
                        };

                        JWT.createTokenAccess(userInfo).then(token => {
                            res.cookie('token', token, {
                                maxAge: 1000 * 60 * 60,
                            });

                            return res.status(200).json({
                                message: '✅ Usuario autenticado correctamente',
                                user : {
                                    ...userInfo,
                                    token
                                }
                            });
                        
                        }).catch(err => {
                            return res.status(500).json({
                                message: '❌ Error al generar el token de acceso',
                                error: err.message
                            });
                        });

                    });
                });

        } catch (err) {
            next(err);
        }
    }
}