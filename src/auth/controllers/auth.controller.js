import { JWT } from '../libs/jwt/JWT.js'
import ActiveDirectory from "activedirectory2";

export class AuthController {
    static async login(req, res, next) {
        try {

            const { username, password } = req.body;

            if(!username || !password) {
                const err = new Error('❌ Usuario y contraseña son requeridos');
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
                    return res.status(500).json({
                        message: '❌ Usuario bloqueado. Comuníquese con la mesa de ayuda.'
                    });
                }

                if(!auth) return res.status(401).json({ message: '❌ Usuario o contraseña incorrectos' })
                
                // Buscar usuario y obtener atributos específicos
                const attributes = [
                    'displayName', 'badPwdCount', 'lockoutTime', 'department',
                    'cn', 'sn', 'givenName', 'mail', 'telephoneNumber'
                ];

                ad.findUser(username, attributes, (err, user) => {
                    if (err || !user) 
                        return res.status(401).json({ message: '❌ Usuario o contraseña incorrectos' });
                    
                    const userInfo = {
                        displayName: user.displayName || username,
                        username: username,
                        department: user.department,
                        cn: user.cn || '',
                        sn: user.sn || '',
                        givenName: user.givenName || '',
                        mail: user.mail || '',
                        telephoneNumber: user.telephoneNumber || ''
                    };

                    JWT.createTokenAccess(userInfo).then(token => {
                        res.cookie('token', token, {
                            maxAge: 1000 * 60 * 60,
                           // signed: true 
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

    static async logout(req, res, next) {
        try {

        } catch (err) {
            next(err);
        }
    }
    
}