import express from 'express';
import { UsersController } from '../../controllers';
import { AuthService } from '../../auth/services/auth.service'

class UsersMiddleware {
    cont: UsersController | any;
    constructor() {
        this.cont = new UsersController('user');
    }
    static async createInstance() {
        return await Promise.resolve(new UsersMiddleware())
    }
    verifyUser: any = AuthService.authenticateUser;

    getUserFromReq(req:express.Request){
        return req.body && req.body.email ? this.cont.getOneByQuery({email:req.body.email}) : null;
    }
    validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction){
            if ( req.body.email || req.body.username && req.body.password) {
                next();
            } else {
                this.cont.resError(res,'Missing required body fields')
            }
    }

  validateSameEmailDoesntExist (req: express.Request, res: express.Response, next: express.NextFunction){
            this.getUserFromReq(req) ? this.cont.sendJson({ success:false, error: `User email already exists` }, 400, res) : next();
    }

    validateSameEmailBelongToSameUser(req: express.Request, res: express.Response, next: express.NextFunction){
            const user = this.getUserFromReq(req)
            user && user._id === req.params.id ? next() : this.cont.sendJson({ error: `Invalid email` }, 400, res);
    }

    // Here we need to use an arrow function to bind `this` correctly
    validatePatchEmail(req: express.Request, res: express.Response, next: express.NextFunction){
           req.body && req.body.email ?  this.validateSameEmailBelongToSameUser(req, res, next): next();
    }

    validateUserExists(req: express.Request, res: express.Response, next: express.NextFunction){
         this.getUserFromReq(req) ? next() : this.cont.sendJson({ error: 'User does not exist : ' +req.body.email }, 404, res);
    }
    
    verifyUserIsAdmin(req: any, res: express.Response, next: express.NextFunction){
            req.user && req.user.admin ? next() : this.cont.resError(res,'you are not authorized')
  
    }

    extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }

}

export default UsersMiddleware;