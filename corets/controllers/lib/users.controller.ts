import express from 'express';
import { DefaultController } from './default.controller'
import passport from 'passport';
import { AuthService } from '../../auth/services/auth.service'

export class UsersController extends DefaultController {

  constructor(svc: string) {
    super(svc)
  }

 async signup(req: express.Request, res: express.Response, next: express.NextFunction){
      await this.db.model.register(req.body, req.body.password, this.callBack(res).done)
  }

 async login(req: express.Request, res: express.Response, next: express.NextFunction){
     this.authenticateUser((user: any) => {      
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

  profile(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
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

 async checkJWTtoken(req: express.Request, res: express.Response, next: express.NextFunction){
      await passport.authenticate('jwt', { session: false }, this.callBack(res).done)(req, res, next);
  }

  authenticateUser(cb?: any) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      passport.authenticate('local', this.callBack(res,cb).done)(req, res, next);
    }
  }
  // helper
  getUserByEmail(email: string) {
    return this.db.getOneByQuery({ email: email });
  }
}






