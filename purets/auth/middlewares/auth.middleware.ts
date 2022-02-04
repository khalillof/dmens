import express from 'express';
import argon2 from 'argon2';
import {getSvc, returnJson} from '../../common/customTypes/types.config'

export class AuthMiddleware {
    private static instance: AuthMiddleware;
    static getInstance() {
        if (!AuthMiddleware.instance) {
            AuthMiddleware.instance = new AuthMiddleware();
        }
        return AuthMiddleware.instance;
    }

    async validateBodyRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        if(req.body && req.body.email && req.body.password){
            next();
        }else{
            returnJson({error: 'Missing body fields: email, password'}, 400,res);
        }
    }

    async verifyUserPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
       let db:any = getSvc('/users');
        await db.getUserByEmail(req.body.email).then(async (user:any)=>{
        if (user) {
            let passwordHash = user.password;
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    provider: 'email',
                    password: passwordHash
                    //permissionLevel: user.permissionLevel,
                };
                next();
            } else {
                returnJson({error: 'Invalid e-mail and/or password'}, 400,res);
            }
        } else {
            returnJson({error: 'Invalid e-mail and/or password'}, 400,res);
        }
    }).catch((err:any)=> next(err));
    }
}