import jwt from 'jsonwebtoken';

export class JWT {

    static async createTokenAccess(payload){
        return new Promise((resolve, reject) => {
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : "1h" },
                (err, token) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(token);
                    }
                }
            );
        });
    }
}