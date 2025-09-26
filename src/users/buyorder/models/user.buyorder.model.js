import { ConnDataBase } from '../../../app/database/conn.database.js';

const conn = new ConnDataBase().connect(String(process.env.DB_BUYORDER_NAME));

export class UserBuyOrderModel {
    static async getUsersAllowed(){
        const usersAllowed = await conn.request().query(`
            SELECT username FROM buyorder_db.dbo.usuarios WHERE estado = 'Activo'
        `);
        return usersAllowed.recordset
    }
}