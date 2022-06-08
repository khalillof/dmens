import express from 'express';
import {isValidRole, dbStore, responce} from '../../common/index.js';
import {IMiddlewares} from '../../interfaces/index.js';
export class Middlewares implements IMiddlewares {


    static async createInstance() {
        return await Promise.resolve(new Middlewares())
    }

  async  getUserFromReq(req:express.Request){
    return req.body && req.body.email ? await dbStore['account'].findOne({email:req.body.email}) : null;
    }
    validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction){

        if (req.body.email || req.body.username && req.body.password) {         
            next();
        } else {
          responce(res).fail('Missing required body fields')
        }
    }

 async validateSameEmailDoesntExist (req: express.Request, res: express.Response, next: express.NextFunction){
    await  this.getUserFromReq(req) ? responce(res).notAuthorized('User email already exists') : next();
    }
    
  validateCurrentUserOwnParamId(req: any, res: express.Response, next: express.NextFunction){
      req.user && String(req.user._id) === String(req.params['id']) ? next() :responce(res).notAuthorized();
      } 
   validateBodyEmailBelongToCurrentUser(req: any, res: express.Response, next: express.NextFunction){
    req.user && req.body.email && req.body.email === req.user.email  ? next() :responce(res).notAuthorized();
    }
    validateHasQueryEmailBelongToCurrentUser(req: any, res: express.Response, next: express.NextFunction){
      req.user && req.query.email && req.query.email === req.user.email  ? next() :responce(res).notAuthorized('not authorized, require valid email');
      }

  async  userExist(req: express.Request, res: express.Response, next: express.NextFunction){
    await  this.getUserFromReq(req) ? next() :responce(res).notAuthorized('User does not exist : ' +req.body.email);
    }
    
    isAuthenticated(req: any, res: express.Response, next: express.NextFunction){
        req.isAuthenticated() ? next() :responce(res).notAuthorized('you are not authorized');

}
 // roles
 isRolesExist(roles:[string]){
    if (roles) {
      for (let i = 0; i < roles.length; i++) {
        if (!isValidRole(roles[i])) {
          return false;
        }
      }
    }
    return true;

  };


isInRole(roleName:string){
  return async (req: any, res: express.Response, next: express.NextFunction)=>{
    if(!req.isAuthenticated()){
      responce(res).notAuthorized('you are not authorized')
    return;
  }
  let reqUser:any= req.user  && req.user.roles ? req.user : await  dbStore['account'].findById(req.user._id);

let roles = await dbStore['role'].model!.find({_id: { $in: reqUser.roles }})
          if(roles && roles.length > 0){
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === roleName) {
              next();
              return;
            }
          }
        }

  responce(res).notAuthorized("Require Admin Role!" );
          return;  
}
}

}
