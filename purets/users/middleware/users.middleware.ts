import express from 'express';
import {getCont, returnJson, createInstance} from '../../common/customTypes/types.config'
import {JwtService} from '../../auth/services/jwt.service'
import argon2 from 'argon2';
class UsersMiddleware {
 
    static async createInstance(){
        let usm = new UsersMiddleware()
        return await Promise.resolve(usm)
    }
    verifyUser: any =  new JwtService().verifyUser;
    
    async validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
        if(req.body && req.body.email && req.body.password){
            next();
        }else{
            returnJson({error: 'Missing body fields: email, password'}, 400,res);
        }
    }

    async verifyUserPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
       let db:any = getCont('/users');
        await db.getUserByEmail(req.body.email).then(async (user:any)=>{
        if (user) {
            let passwordHash = user.password;
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body.password = passwordHash;
                req.body._id = user._d;
                //req.user = user;
                //req.body = {
                //    userId: user._id,
                //    email: user.email,
                //    provider: 'email',
                //    password: passwordHash
                    //permissionLevel: user.permissionLevel,
                //};
                 next();
            } else {
                returnJson({error: 'Invalid e-mail and/or password'}, 400,res);
            }
        } else {
            returnJson({error: 'Invalid e-mail and/or password'}, 400,res);
        }
    }).catch((err:any)=> next(err));
    }

    async validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
        let db:any = getCont('/users');
       await db.getUserByEmail(req.body.email).then((user:any)=>{
          user ? returnJson({error: `User email already exists`}, 400, res): next();

        }).catch((err:any)=>{
            console.error(err);
            next(err)
        })      
    }

    async validateSameEmailBelongToSameUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        let db:any = getCont('/users');
        const user = await db.getUserByEmail(req.body.email);
        if (user && user.id === req.params.userId) {
            next();
        } else {
            returnJson({error: `Invalid email`}, 400, res);
        }
    }

    // Here we need to use an arrow function to bind `this` correctly
   async validatePatchEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body.email) {           
            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    }

    async validateUserExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        let db:any = getCont('/users');
        await db.getUserByEmail(req.body.email).then((user:any) => {            
             user ? next(): returnJson({error: 'User ${req.body.email'},404,res);           
          }).catch((err:any) => next(err));
    }

   async verifyUserIsAdmin(req: any, res: any, next: any){
       
        if (req.user.admin || req.body.comment){
            next() 
         }else{
          returnJson({error: 'you are not authorized'},401,res);
         }
    }  

    async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }
}

export default UsersMiddleware;