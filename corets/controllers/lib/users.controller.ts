import express from 'express';
import { DefaultController } from './default.controller'
import passport from 'passport';
import { AuthService } from '../../auth/services/auth.service'
import fs from 'fs';
import path from 'path'

export class UsersController extends DefaultController {

  constructor(svc: string) {
    super(svc)
  }
  static async createInstance() {
    return await Promise.resolve(new UsersController('user'));
  }

  signup(self: any) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await self.db.model.register(req.body, req.body.password, self.resultCb.res(res, next).cb)
    }
  }

  login(self: any) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {

      await self.authenticateUser(self, (user: any) => {
        req.login(user, function (err) {
          if (err) {
            res.json({ success: false, message: err })
          } else {
            const token = AuthService.generateToken({ _id: user._id });
            res.json({ success: true, message: "Authentication successful", token: token });
          }
        })
      })(req, res, next);

    }
  }

  profile(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }
  async schema(req: express.Request, res: express.Response, next: express.NextFunction) {
    
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
  updateUser(self: any) {
    return async (req: any, res: express.Response, next: express.NextFunction) => {
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
  logout(req: any, res: express.Response, next: express.NextFunction) {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    } else {
      res.json({ success: true, message: "You are not logged in!" });
    }
  }

  facebook(req: any, res: express.Response, next: express.NextFunction) {

    if (req.user) {
      var token = AuthService.generateToken({ _id: req.user._id });
      res.json({ success: true, token: token, status: 'You are successfully logged in!' });
    }
  }

  checkJWTtoken(self: this) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await passport.authenticate('jwt', { session: false }, self.resultCb.res(res, next).cb)(req, res, next);
    };
  }

  authenticateUser(self: this, callback?: any) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await passport.authenticate('local', self.resultCb.res(res, next, callback).cb)(req, res, next);
    }
  }
  // helper
  getUserByEmail(email: string) {
    return this.db.First({ email: email });
  }
}






