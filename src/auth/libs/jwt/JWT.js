import jwt from 'jsonwebtoken';

export class JWT {
    static async createTokenAccess(payload, expiresIn = "1h"){
        return new Promise((resolve, reject) => {
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn },
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