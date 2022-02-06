import express from 'express';
import {verify} from 'argon2';


export class AuthMiddleware {
    static async  getInstance() {
        return await Promise.resolve(new AuthMiddleware());
    }

    validateBodyRequest(userCotroller:any){
        return(req: express.Request, res: express.Response, next: express.NextFunction) =>{
        if(req.body && req.body.email && req.body.password){
            next();
        }else{
            userCotroller.sendJson({error: 'Missing body fields: email, password'}, 400,res);
        }
    }}

    verifyUserPassword(userCotroller:any){
        return (req: express.Request, res: express.Response, next: express.NextFunction)=> {
        userCotroller.getUserByEmail(req.body.email).then(async (user:any)=>{
        if (user) {
            let passwordHash = user.password;
            if (await verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    provider: 'email',
                    password: passwordHash
                    //permissionLevel: user.permissionLevel,
                };
                next();
            } else {
                userCotroller.sendJson({error: 'Invalid e-mail and/or password'}, 400,res);
            }
        } else {
            userCotroller.sendJson({error: 'Invalid e-mail and/or password'}, 400,res);
        }
    }).catch((err:any)=> next(err));
    }
}
}