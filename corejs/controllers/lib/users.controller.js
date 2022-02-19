"use strict";
const { DefaultController } = require('./default.controller');
const passport = require('passport');
const { AuthService } = require('../../auth/services/auth.service');
const fs = require('fs');
const path = require('path');

class UsersController extends DefaultController {

  constructor(svc) {
    super(svc)
  }
  static async createInstance() {
    return await Promise.resolve(new UsersController('user'));
  }

 async signup(req, res, next){
    await  this.db.model.register(req.body, req.body.password,this.resultCb.res(res,next).cb)
    }
  

 async login(req, res, next){
      this.authenticateUser((user)=>{
        req.login(user, function(err){
          if(err){
            res.json({success: false, message: err})
          }else{
            const token =  AuthService.generateToken({ _id: user._id });
            res.json({success:true, message:"Authentication successful", token: token });
          }
        })
      })(req, res, next);
  }

updateUser(self=this) {
  return async (req, res, next) => {
    if (req.isUnauthenticated()) {
      res.status(401).send({ success: false, message: 'unauthorized' })
    } else {
      // user is already authenticated that is why I am checking for body.password only
      let User = await self.db.model.findById(req.user._id);
      if (req.user.password !== req.body.password)
        await User.setPassword(req.body.password)
      await User.save(req.body, self.resultCb.res(res, next).cb)
    }
  }
}
  profile(req, res, next){
      res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
      })
    
  }

  schema(req, res, next){
    if (req.body.json) {
      let filepath = path.resolve(__dirname, '../../models/schema/uploads/schema.' + Date.now() + '.json');

      //stringify JSON Object
      let jsonContent = JSON.stringify(req.body.json);

      fs.writeFile(filepath, jsonContent,'utf8', function (err) {
        if (err) {
          console.log(err);
          res.json({ success: false, message: 'operation faild' })
        } else {
          console.log('wrote new file to :' + filepath);
          res.json({ success: true, message: 'operation successfull' })
        }

      });

    }
    else if (req.file) {
      let file = req.file;
      console.log("json file saved on :" + file.path);
      res.json({ success: true, message: 'operation successfully executed' })
    } else {
      res.json({ success: false, message: 'operation unsuccessfull, expected json file' })
    }
  }

  logout(req, res, next){
      if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
      } else {
        res.json({success:true, message:"You are not logged in!" });
      }
  }

  facebook(req, res, next){
      if (req.user) {
        var token = AuthService.generateToken({ _id: req.user._id });
        res.json({ success: true, token: token, status: 'You are successfully logged in!' });
      }
    }


 async checkJWTtoken(req, res, next){
      passport.authenticate('jwt', this.resultCb.res(res,next).cb)(req, res, next);
  };

  // helper
  getUserByEmail(email) {
    return this.db.First({ email: email });
  }

  authenticateUser(callback) {
    return (req, res, next) => {
     passport.authenticate('local', this.resultCb.res(res,next,callback).cb)(req, res, next);
    }
  }
  
}

exports.UsersController = UsersController;
