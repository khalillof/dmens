import express from 'express';
import {JsonModel} from '../../models/json.model'
import { AuthService } from '../../auth/services/auth.service'
import {dbStore} from '../../common/customTypes/types.config'

class UsersMiddleware {
    userDb: JsonModel;
    verifyUser: any = AuthService.authenticateUser;

    constructor() {
        this.userDb = dbStore['user'];
    }

    static async createInstance() {
        return await Promise.resolve(new UsersMiddleware())
    }
    
  async  getUserFromReq(req:express.Request){
        return req.body && req.body.email ? await this.userDb.getOneByQuery({email:req.body.email}) : null;
    }
    validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction){
            if ( req.body.email || req.body.username && req.body.password) {
                next();
            } else {
                res.json({success:false, error:'Missing required body fields'})
            }
    }

 async validateSameEmailDoesntExist (req: express.Request, res: express.Response, next: express.NextFunction){
          await  this.getUserFromReq(req) ? res.status(400).json({ success:false, error: `User email already exists` }) : next();
    }

   async validateSameEmailBelongToSameUser(req: express.Request, res: express.Response, next: express.NextFunction){
            const user = await this.getUserFromReq(req)
            user && user._id === req.params.id ? next() : res.status(400).json({ error: `Invalid email` });
    }

    // Here we need to use an arrow function to bind `this` correctly
  async  validatePatchEmail(req: express.Request, res: express.Response, next: express.NextFunction){
           req.body && req.body.email ? await  this.validateSameEmailBelongToSameUser(req, res, next): next();
    }

  async  validateUserExists(req: express.Request, res: express.Response, next: express.NextFunction){
       await  this.getUserFromReq(req) ? next() : res.status(404).json({ error: 'User does not exist : ' +req.body.email });
    }
    
    verifyUserIsAdmin(req: any, res: express.Response, next: express.NextFunction){
            req.user && req.user.admin ? next() : res.status(400).json({success:false,error:'you are not authorized'})
  
    }

    extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }

}

export default UsersMiddleware;