"use strict";
const { DefaultController } = require('./default.controller')
const { hash } = require('argon2');
const passport = require('passport');
const { JwtService } = require('../auth/services/jwt.service');
class UsersController extends DefaultController {

  
  constructor(svc) {
    super(svc)
  }
  static async createInstance() {
    return await Promise.resolve(new UsersController('user'));
  }

  signup(self) {
    return (req, res, next) => {

      req.body.password = (async () => await hash(req.body.password));

      self.register({ username: req.body.username, email: req.body.email, password: req.body.password },
        req.body.password, (err, user) => {

          if (err) {
            self.sendJson({ err: err }, 500, res)
          }
          else {
            if (req.body.firstname)
              user.firstname = req.body.firstname;
            if (req.body.lastname)
              user.lastname = req.body.lastname;
            user.save((err, user) => {
              if (err) {
                self.sendJson({ err: err }, 500, res)
              }
              passport.authenticate('local')(req, res, () => {
                self.sendJson({ success: true, status: 'Registration Successful!' }, 204, res);
              });
            });
          }
        });;
    }
  }

  login(self) {
    return (req, res, next) => {

      passport.authenticate('local', (err, user, info) => {

        if (err)
          next(err);

        if (!user)
          self.sendJson({ success: false, status: 'Login Unsuccessful!', err: info }, 401, res)

        req.logIn(user, (err) => {

          if (err) {
            self.sendJson({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!' }, 401, res)
          }

          // var token = authenticate.getToken({_id: user._id});
          var token = JwtService.generateToken({ _id: user._id });

          self.sendJson(({ success: true, status: 'Login Successful!', token: token }), 200, res);
        });
      })(req, res, next);
    }
  };

  logout(self) {
    return (req, res, next) => {
      if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
      } else {
        self.sendJson({ err: "You are not logged in!" }, 403, res)
      }
    }
  }

  facebook(self) {
    return (req, res, next) => {

      if (req.user) {
        var token = JwtService.generateToken({ _id: req.user._id });
        self.sendJson({ success: true, token: token, status: 'You are successfully logged in!' }, 204, res);
      }
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
        req.body.password = (async () => await hash(req.body.password));
      }
      self.super.patch(req, res, next);
    }
  }

  put(self) {
    return (req, res, next) => {
      req.body.password = (async () => await hash(req.body.password));
      self.super.put(req, res, next);
    }
  };

  checkJWTtoken(self) {
    return (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
          next(err);

        if (!user) {
          self.sendJson({ status: 'JWT invalid!', success: false, err: info }, 401, res);
        }
        else {
          self.sendJson({ status: 'JWT valid!', success: true, user: user }, 200, res);

        }
      })(req, res, next);
    }
  };
  // helper
  getUserByEmail(email, self) {
    return  self.First({ email: email });
  }

}

exports.UsersController = UsersController;
