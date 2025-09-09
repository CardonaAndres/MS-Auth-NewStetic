import { ConnDataBase } from '../../../app/database/conn.database.js';

const conn = new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class UserSstModel {
    static async getUsersAllowed(){
        const usersAllowed = await conn.request().query(`SELECT username FROM usuarios`);
        return usersAllowed.recordset
    }
}