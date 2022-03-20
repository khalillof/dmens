"use strict";
const { DefaultController } = require('./default.controller');
const { AuthService } = require('../../services');
class AccountsController extends DefaultController {

  constructor(name) {
    super(name)
  }

 async signup(req, res, next){
  await this.db.model.register(req.body, req.body.password, this.callBack(res).done)
    }

 async login(req, res, next){
   // local /jwt
  return await AuthService.authenticateUser('local')(req, res, next);
 }

async forgetPassword(req, res, next){
  //Normally setPassword is used when the user forgot the password 
  if(!req.body.email && req.body.password){
    return this.resError(res,'some requied body fields are missing')
   }
   let user = await this.getOneByQuery({email:req.body.email});
   if (!user){
     return this.resError(res,'some of your input are not valid')
     }else{
      return  user.setPassword(req.body.password, this.callBack(res).done)
   }

}
async changePassword(req, res, next){
  //changePassword is used when the user wants to change the password
  if(req.isUnauthenticated()){
    res.status(400).json({success:false,error:'you are not authorized'});
  }
  if (!req.body.oldpassword || !req.body.newpassword){
  return this.resError(res,'old and new pasword field are required')
  }else{
     

   return  req.user.changePassword(req.body.oldpassword, req.body.newpassword, (err)=>{
    if(err)
     return res.json({success:true,error:err})
     return this.resSuccess(res)
  })
}
}
async updateUser(req, res, next){
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
  profile(req, res, next){
     return res.json({
       message: 'You made it to the secure route',
       user: req.user,
     })
 
  }

  logout(req, res, next){
    req.logOut();
      if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        //res.redirect('/');
        this.resSuccess(res, "You are logged out!")
      } else {
        this.resSuccess(res, "You are not logged in!")
      }
  }

  facebook(req, res, next){
      if (req.user) {
        var token = AuthService.generateToken({ _id: req.user._id });
        res.json({ success: true, token: token, status: 'You are successfully logged in!' });
      }
    }
  
}

exports.AccountsController = AccountsController;
