import { throwError } from '../../app/utils/throwError.js'
import { UserSstModel } from '../../users/sst/models/user.sst.model.js';

export class AllowedUsers {
    static async defineAllowedUsers(appName) {
        const allowedUsers = [
            'ptic',
            'ptic2',
            'stapias',
            'amjimenez'
        ];

        switch (appName) {
            case 'SST':
                try {
                    const users = await UserSstModel.getUsersAllowed();
                    return users.map(user => user.username); 
                } catch (err) {
                    throwError(err.message || 'Error al consultar los usuarios', 500);
                }
            break;

            case 'BUYORDER':
                allowedUsers.push(

                );
            break;

            default:
                throwError('App desconocida', 404)
        }

        return allowedUsers

    }
}