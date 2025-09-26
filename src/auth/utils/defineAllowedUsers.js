import { throwError } from '../../app/utils/throwError.js'
import { UserSstModel } from '../../users/sst/models/user.sst.model.js';
import { UserBuyOrderModel } from '../../users/buyorder/models/user.buyorder.model.js';

export class AllowedUsers {
    static async defineAllowedUsers(appName) {

        switch (appName) {
            case 'SST':
                try {
                    const users = await UserSstModel.getUsersAllowed();
                    return users.map(user => user.username); 
                } catch (err) {
                    throwError(err.message || 'Error al consultar los usuarios de: SST', 500);
                }
            break;

            case 'BUYORDER':
                try {
                    const users = await UserBuyOrderModel.getUsersAllowed();
                    return users.map(user => user.username); 
                } catch (err) {
                    throwError(err.message || 'Error al consultar los usuarios de: BuyOrder', 500);
                }
            break;

            default:
                throwError('App desconocida', 404)
        }

        return []

    }
}