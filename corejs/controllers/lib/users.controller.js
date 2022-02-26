"use strict";
const { DefaultController } = require('./default.controller');
const passport = require('passport');
const { AuthService } = require('../../auth/services/auth.service');

class UsersController extends DefaultController {

  constructor(name) {
    super(name)
  }
  static async createInstance() {
    return await Promise.resolve(new UsersController('user'));
  }

 async signup(req, res, next){
  await this.db.model.register(req.body, req.body.password, this.callBack(res).done)
    }

 async login(req, res, next){
  this.authenticateUser((user) => {      
    req.login(user,  (err)=>{
      if (err) {
        this.resErrIfErr(res,err)
      } else {
        const token = AuthService.generateToken({ _id: user._id });
        res.json({ success: true, message: "Authentication successful", token: token });
      }
    });
  })(req, res, next);
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
      res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
      })
    
  }

  logout(req, res, next){
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


 async checkJWTtoken(req, res, next){
  await passport.authenticate('jwt', { session: false }, this.callBack(res).done)(req, res, next);
  };

  authenticateUser(cb) {
    return (req, res, next) => {
      passport.authenticate('local', this.callBack(res,cb).done)(req, res, next);
    }
  }
  
}

exports.UsersController = UsersController;
