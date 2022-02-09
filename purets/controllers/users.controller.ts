import express from 'express';
import {DefaultController} from './default.controller'
import passport from 'passport';
import {AuthService} from '../auth/services/auth.service'

export class UsersController extends DefaultController {

  constructor(svc:string) {
    super(svc)
  }
  static async createInstance() {
    return await Promise.resolve(new UsersController('user'));
  }
  
    signup(self:any) {
      return (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        var _user: any = { username: req.body.username, email: req.body.email};
        if (req.body.firstname)
            _user['firstname'] = req.body.firstname;
        if (req.body.lastname)
            _user['lastname'] = req.body.lastname;
  
        self.db.model.register(_user, req.body.password, (err:string, user:any) => {
              if (err){
                res.json({ success: false, message: 'Registration Unsuccessful!', err: err })
              }else{
                res.json({success: true, message: 'Registration Successful!'})
              }
          })
    }}
    
    login(self:any) {
      return (req: express.Request, res: express.Response, next: express.NextFunction)=>{
     
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
  }
    profile(self:any){
      return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.json({
          message: 'You made it to the secure route',
          user: req.user,
          token: req.query.secret_token
        })
      }
    }

    logout(req: any, res: express.Response, next: express.NextFunction){
      if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
      }else {
        res.json({success:true, message:"You are not logged in!" });
      }
    }
       
    facebook(req: any, res: express.Response, next: express.NextFunction){
        
      if (req.user) {
        var token = AuthService.generateToken({ _id: req.user._id });
        res.json({ success: true, token: token, status: 'You are successfully logged in!' });
      }
    }
    
    create(self:any) {
      return (req: express.Request, res: express.Response, next: express.NextFunction)=> {
        //req.body.password = (async ()=> await hash(req.body.password));
       self.super.create(req,res,next)
    }
  }

    patch(self:any) {
      return (req: express.Request, res: express.Response, next: express.NextFunction)=> {
        if(req.body.password){
          //  req.body.password = ( async ()=> await hash(req.body.password));
        }
       self.super.patch(req,res,next);
    }
  }

  put(self:any) {
    return (req: express.Request, res: express.Response, next: express.NextFunction)=> {
        //req.body.password = (async()=> await hash(req.body.password));
       self.super.put(req,res,next);
    }
  }

    checkJWTtoken(req: express.Request, res: express.Response, next: express.NextFunction){
      passport.authenticate('jwt', {session: false}, (err:any, user:any, info:any) => {
        if (err)
           next(err);
        
        if (!user) {
          res.json({status: 'JWT invalid!', success: false, err: info});
        }
        else {
          res.json({status: 'JWT valid!', success: true, user: user});
    
        }
      }) (req, res, next);
    };

    setPassword(self:any ) {
      return (req: express.Request, res: express.Response, next: express.NextFunction) => {
  
        self.db.model.setPassword(req.body.password,(err:string, user:any) => {
              if (err)
                res.json({ success: false, message: 'set password Unsuccessful!', err: err })
              if(user)
                res.json({success: true, message: 'password set Successful!'})
          }).catch((err:string)=> next(err))
      }
    }
    
    changePassword(self:any) {
      return (req: express.Request, res: express.Response, next: express.NextFunction) => {
  
        self.db.model.changePassword(req.body.oldpassword, req.body.newpassword,(err:string, user:any) => {
  
              if (err)
                res.json({ success: false, message: 'change password Unsuccessful!', err: err })
              if(user){
                res.json({success: true, message: 'password change Successful!'})
              }
          }).catch((err:string)=> next(err))
      }
    }

    // helper
    getUserByEmail(email:string) {
      return this.db.First({ email: email });
    }
}

  
 


