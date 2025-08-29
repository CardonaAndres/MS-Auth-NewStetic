import ActiveDirectory from "activedirectory2";
import { JWT } from '../libs/jwt/JWT.js'
import { AllowedUsers } from '../utils/defineAllowedUsers.js';
import { BukAPI } from "../utils/bukApi.js";
import { throwError } from "../../utils/throwError.js";

export class AuthController {
    static async loginByDA(req, res, next) {
        try {
            const { username, password, appName } = req.body;
            const usernamesAllowed = AllowedUsers.defineAllowedUsers(appName);

            if(!username || !password) throwError('Usuario y contraseña son requeridos', 400)

            if(!usernamesAllowed.includes(username)) 
                throwError('Usuario no valido para este aplicativo', 409)

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

    static async loginByBuk(req, res, next){
        try {
            const allowedRoles = req.query?.allowedRoles?.split(',') || []

            allowedRoles.forEach((role, i) => {
                if(typeof role !== 'string' || isNaN(parseInt(role, 10))) 
                    throwError('Roles permitidos invalidos', 400)

                allowedRoles[i] = parseInt(role, 10);
            });

            if(!req.body.documentNumber || req.body.documentNumber?.length < 5) 
                throwError('Número de documento invalido', 400)

            const { data: userData, success, message } = await BukAPI.getUser(req.body.documentNumber);

            if(!success) throwError(message, 400);

            if(!userData[0]) throwError('El usuario no ha sido encontrado', 404);

            if(allowedRoles.length > 0){
                const { data: roles, success, message } = await BukAPI.getRoles();

                if(!success) throwError(message, 400)

                const rolesIDs = new Set(roles?.map(r => r.id));
                const allIdAreValited = allowedRoles.every(id => rolesIDs.has(id));
                
                if(!allIdAreValited) throwError('Error al validar los roles', 400);

                if(!allowedRoles.includes(userData[0]?.current_job?.role.role_family?.id))
                    throwError('El usuario no tiene el rol permitido', 409);

            }
        
            const token = await JWT.createTokenAccess(userData[0], "15m");

            return res.status(200).json({
                message: '✅ Usuario autenticado correctamente',
                userData: userData[0],
                token
            });

        } catch (err) {
            next(err);
        }
    }
}