import NodeCache from "node-cache";
import ActiveDirectory from "activedirectory2";
import { JWT } from '../libs/jwt/JWT.js'
import { AllowedUsers } from '../utils/defineAllowedUsers.js';
import { BukAPI } from "../services/buk.js";
import { throwError } from "../../app/utils/throwError.js";
import { ADErrorMessages, DEFAULT_AD_ERROR } from "../utils/adErrorMessages.js";

const usersCache = new NodeCache({ stdTTL: 1800 });
const rolesCache = new NodeCache({ stdTTL: 3600 });

export class AuthController {
    static async loginByDA(req, res, next) {
        try {
            const { username, password, appName } = req.body;

            let usernamesAllowed = usersCache.get(appName);

            if (!usernamesAllowed) {
                usernamesAllowed = await AllowedUsers.defineAllowedUsers(appName);
                usersCache.set(appName, usernamesAllowed); 
            }

            if (!usernamesAllowed.includes(username)) 
                throwError('Usuario no válido para este aplicativo', 409);

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
                    let msg = DEFAULT_AD_ERROR;

                    if (err.message) {   
                        const code = Object.keys(ADErrorMessages).find(c => err.message.includes(c));
                        if (code) msg = ADErrorMessages[code];
                    }

                    return res.status(401).json({ message: msg });
                }

                if (!auth) return res.status(401).json({ message: ADErrorMessages["52e"] });

                ad.findUser({ attributes: ["*"] }, username, (err, user) => {
                    if (err || !user) return res.status(401).json({ message: ADErrorMessages["52e"] });
                
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
                            message: 'Usuario autenticado correctamente',
                            user : {
                                ...userInfo,
                                token
                            }
                        });
                    
                    }).catch(err => {
                        return res.status(500).json({
                            message: 'Error al generar el token de acceso',
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
                let roles = rolesCache.get("roles");

                if (!roles) {
                    const { data, success, message } = await BukAPI.getRoles();

                    if (!success) throwError(message, 400);

                    roles = data;
                    rolesCache.set("roles", roles);
                }

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