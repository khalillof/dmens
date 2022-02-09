"use strict";
const { DefaultController } = require('./default.controller');
const passport = require('passport');
const { AuthService } = require('../auth/services/auth.service');


class UsersController extends DefaultController {


  constructor(svc) {
    super(svc)
  }
  static async createInstance() {
    return await Promise.resolve(new UsersController('user'));
  }

  signup(self) {
    return (req, res, next) => {

      var _user= { username: req.body.username, email: req.body.email};
      if (req.body.firstname)
          _user['firstname'] = req.body.firstname;
      if (req.body.lastname)
          _user['lastname'] = req.body.lastname;

      self.db.model.register(_user, req.body.password, (err, user) => {
            if (err){
              res.json({ success: false, message: 'Registration Unsuccessful!', err: err })
            }else{
              res.json({success: true, message: 'Registration Successful!'})
            }
        })
    }
  }

  login(req, res, next){
     
      passport.authenticate('local', (err, user, info) => {
        if(err){
          res.json({success: false, message: err || info})
        } 

        if (! user) {
           res.json({success: false, message: 'username or password incorrect'})
         }else{
          req.login(user, function(err){
            if(err){
              res.json({success: false, message: err})
            }else{
              const token =  AuthService.generateToken({ _id: user._id });
              res.json({success:true, message:"Authentication successful", token: token });
            }
          })
        }     
    })(req, res);
  }
  profile(self){
    return (req, res, next) => {
      res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
      })
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
  
  create(self) {
    return (req, res, next) => {
      req.body.password = (async () => await hash(req.body.password));
      self.super.create(req, res, next)
    }
  }

  patch(self) {
    return (req, res, next) => {
      if (req.body.password) {
        //req.body.password = (async () => await hash(req.body.password));
      }
      self.super.patch(req, res, next);
    }
  }

  put(self) {
    return (req, res, next) => {
      //req.body.password = (async () => await hash(req.body.password));
      self.super.put(req, res, next);
    }
  };

  checkJWTtoken(req, res, next){
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
          next(err);

        if (!user) {
          res.json({success: false, status: 'JWT invalid!', err: info });
        }
        else {
          res.json({success:true, status: 'JWT valid!',  user: user });

        }
      })(req, res, next);
  };

  
  setPassword(self) {
    return (req, res, next) => {

      self.db.model.setPassword(req.body.password,(err, user) => {
            if (err)
              res.json({ success: false, message: 'set password Unsuccessful!', err: err })
            if(user)
              res.json({success: true, message: 'password set Successful!'})
        }).catch(err=> next(err))
    }
  }
  
  changePassword(self) {
    return (req, res, next) => {

      self.db.model.changePassword(req.body.oldpassword, req.body.newpassword,(err, user) => {

            if (err)
              res.json({ success: false, message: 'change password Unsuccessful!', err: err })
            if(user){
              res.json({success: true, message: 'password change Successful!'})
            }
        }).catch(err=> next(err))
    }
  }
  // helper
  getUserByEmail(email) {
    return this.db.First({ email: email });
  }

}

exports.UsersController = UsersController;
