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
                    users.map(user => allowedUsers.push(user.username));
                } catch (err) {
                    throwError(err.message | 'Error al consultar los usuarios', 500);
                }
            break;

            case 'BUYORDER':
                allowedUsers.push(

                );
            break;

            default:
                const err = new Error('App desconocida');
                err.status = 404;
                throw err; 
        }

        return allowedUsers

    }
}