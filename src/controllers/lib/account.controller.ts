import express from 'express';
import { DefaultController } from './default.controller.js';
import {authenticateUser, generateJwt} from '../../services/index.js';
import { envs} from '../../common/index.js';

export class AccountController extends DefaultController {

    constructor() {
        super('account')
    }
    
    async secure(req: express.Request, res: express.Response, next: express.NextFunction){
      const data =envs.getSecret(req.query['api'] as string) ;
       this.responce(res).data(data!)
       }
 async signup(req: express.Request, res: express.Response, next: express.NextFunction){
  let mdl:any=this.db.model!;
     await mdl.register(req.body, req.body.password, this.responce(res).errObjInfo)
 }

async signin(req: express.Request, res: express.Response, next: express.NextFunction){
 // local /jwt
 return await authenticateUser('local')(req, res, next);
}
async forgetPassword(req: express.Request, res: express.Response, next: express.NextFunction){
 //Normally setPassword is used when the user forgot the password 
 if(!req.body.email && req.body.password){
  return this.responce(res).badRequest('some requied body fields are missing')
 }
 let user = await this.db.findOne({email:req.body.email});
  if (!user){
    return this.responce(res).badRequest('some of your input are not valid')
    }else{
     return  user.setPassword(req.body.password, this.responce(res).errObjInfo)
  }

}
async changePassword(req: any, res: express.Response, next: express.NextFunction){
 //changePassword is used when the user wants to change the password
 if(req.isUnauthenticated()){
   this.responce(res).unAuthorized();
 }
 if (!req.body.oldpassword || !req.body.newpassword){
 return this.responce(res).fail('old and new pasword field are required')
 }else{
     let user:any=await this.db.model!.findById(req.user._id);
  return  user.changePassword(req.body.oldpassword, req.body.newpassword,this.responce(res).errSuccess)
}
}
async profile(req: any, res: express.Response, next: express.NextFunction) {
//let item = await this.db.findById(String(req.user._id));
   return this.responce(res).data(req.user,'You made it to the secure route')
 }

async  updateUser(req: any, res: express.Response, next: express.NextFunction){
 if (req.isUnauthenticated()) {
   this.responce(res).unAuthorized()
 } else {
   // user is already authenticated that is why I am checking for body.password only
   let User = await this.db.findById(req.params.id);
   if (req.user.password !== req.body.password)
     await User.setPassword(req.body.password)
   await User.save(req.body, this.responce(res).errObjInfo)
 }
 }

 logout(req: any, res: any, next: express.NextFunction) {
   req.logOut();
     if (req.session) {
       req.session.destroy();
       res.clearCookie('session-id');
       //res.redirect('/');
       this.responce(res).success("You are logged out!")
     } else {
       this.responce(res).success("You are not logged in!")
     }
 }


}
 