import express from 'express';
import { DefaultController } from './default.controller'
import { AuthService } from '../../services/lib/auth.service'

export class AccountsController extends DefaultController {

  constructor(svc: string) {
    super(svc)
  }

 async signup(req: express.Request, res: express.Response, next: express.NextFunction){
      await this.db.model.register(req.body, req.body.password, this.callBack(res).done)
  }

 async login(req: express.Request, res: express.Response, next: express.NextFunction){
  // local /jwt
  return await AuthService.authenticateUser('local')(req, res, next);
 }
 async forgetPassword(req: express.Request, res: express.Response, next: express.NextFunction){
  //Normally setPassword is used when the user forgot the password 
  if(!req.body.email && req.body.password){
   return this.resError(res,'some requied body fields are missing')
  }
  let user = await this.getUserByEmail(req.body.email);
  if (!user){
    return this.resError(res,'some of your input are not valid')
    }else{
     return  user.setPassword(req.body.password, this.callBack(res).done)
  }

}
async changePassword(req: express.Request, res: express.Response, next: express.NextFunction){
  //changePassword is used when the user wants to change the password
  if(req.isUnauthenticated()){
    res.status(400).json({success:false,error:'you are not authorized'});
  }
  if (!req.body.oldpassword || !req.body.newpassword){
  return this.resError(res,'old and new pasword field are required')
  }else{
     
    let user:any=req.user;
   return  user.changePassword(req.body.oldpassword, req.body.newpassword, (err:any)=>{
    if(err)
     return res.json({success:true,error:err})
     return this.resSuccess(res)
  })
}
}
  profile(req: express.Request, res: express.Response, next: express.NextFunction) {
    return res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.token
    })
  }
 
async  updateUser(req: any, res: express.Response, next: express.NextFunction){
      if (req.isUnauthenticated()) {
        res.status(401).send({ success: false, message: 'unauthorized' })
      } else {
        // user is already authenticated that is why I am checking for body.password only
        let User = await this.db.getOneById(req.params.id);
        if (req.user.password !== req.body.password)
          await User.setPassword(req.body.password)
        await User.save(req.body, this.callBack(res).done)
      }
  }

  logout(req: any, res: express.Response, next: express.NextFunction) {
    req.logOut()
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      //res.redirect('/');
      this.resSuccess(res, "You are logged out!");
    } else {
      this.resSuccess(res, "You are not logged in!");
    }
  }

  facebook(req: any, res: express.Response, next: express.NextFunction) {

    if (req.user) {
      var token = AuthService.generateToken({ _id: req.user._id });
      res.json({ success: true, token: token, status: 'You are successfully logged in!' });
    }
  }

  // helper
 async getUserByEmail(email: string) {
    return await this.db.getOneByQuery({ email: email });
  }
}






