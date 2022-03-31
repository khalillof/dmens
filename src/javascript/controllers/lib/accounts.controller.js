"use strict";
const { DefaultController } = require('./default.controller');
const { authenticateUser,generateGwt } = require('../../services');


class AccountsController extends DefaultController {

  constructor(name) {
    super(name)
  }

 async signup(req, res, next){
  await this.db.model.register(req.body, req.body.password,this.responce(res).errObjInfo)
    }

 async login(req, res, next){
   // local /jwt
  return await authenticateUser('local')(req, res, next);
 }

async forgetPassword(req, res, next){
  //Normally setPassword is used when the user forgot the password 
  if(!req.body.email && req.body.password){

    return this.responce(res).fail('some requied body fields are missing')
   }
   let user = await this.db.findOne({email:req.body.email});
   if (!user){
     return this.responce(res).fail('some of your input are not valid')
     }else{
      return  user.setPassword(req.body.password, this.responce(res).errObjInfo)
   }

}
async changePassword(req, res, next){
  //changePassword is used when the user wants to change the password
  if(req.isUnauthenticated()){
    this.responce(res).notAuthorized();
  }
  if (!req.body.oldpassword || !req.body.newpassword){
  return this.responce(res).fail('old and new pasword field are required')
  }else{
   return await this.db.model.fineById(req.user._id).changePassword(req.body.oldpassword, req.body.newpassword,this.responce(res).errSuccess)
}
}
async updateUser(req, res, next){
    if (req.isUnauthenticated()) {
      this.responce(res).notAuthorized()
    } else {
      // user is already authenticated that is why I am checking for body.password only
      let User = await this.db.findById(req.params.id);
      if (req.user.password !== req.body.password)
        await User.setPassword(req.body.password)
      await User.save(req.body, this.responce(res).errObjInfo)
    }
}
  profile(req, res, next){
    return this.responce(res).item(req.user,'You made it to the secure route')
  }

  logout(req, res, next){
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

  facebook(req, res, next){
      if (req.user) {
        var token = generateGwt(req.user);
        res.json({ success: true, token: token, status: 'You are successfully logged in!' });
      }
    }
  
}

exports.AccountsController = AccountsController;
