import express from 'express';
import {isValidRole, dbStore, responce} from '../../common';
import {IMiddlewares} from '../../interfaces';
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
          responce(res).success(false, 'Missing required body fields')
        }
    }

 async validateSameEmailDoesntExist (req: express.Request, res: express.Response, next: express.NextFunction){
    await  this.getUserFromReq(req) ? responce(res).errStatus(400, 'User email already exists') : next();
    }

   async validateSameEmailBelongToSameUser(req: express.Request, res: express.Response, next: express.NextFunction){
    const user = await this.getUserFromReq(req);
    user && user._id === req.params.id ? next() :responce(res).errStatus(400, 'Invalid email');
    }

    // Here we need to use an arrow function to bind `this` correctly
  async  validatePatchEmail(req: express.Request, res: express.Response, next: express.NextFunction){
           req.body && req.body.email ? await  this.validateSameEmailBelongToSameUser(req, res, next): next();
    }

  async  userExist(req: express.Request, res: express.Response, next: express.NextFunction){
    await  this.getUserFromReq(req) ? next() :responce(res).errStatus(403, 'User does not exist : ' +req.body.email);
    }
    
    isAuthenticated(req: any, res: express.Response, next: express.NextFunction){
        req.isAuthenticated() ? next() :responce(res).errStatus(403, 'you are not authorized');

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
  return async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
    if(!req.isAuthenticated()){
      responce(res).errStatus(400, 'you are not authorized')
    return;
  }
  let reqUser:any=req.user;
let user = await  dbStore['account'].findById(reqUser._id);

let roles = await dbStore['role'].model!.find({_id: { $in: user.roles }})
          if(roles && roles.length > 0){
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === roleName) {
              next();
              return;
            }
          }
        }

        responce(res).errStatus(400, "Require Admin Role!" );
          return;  
}
}

}
