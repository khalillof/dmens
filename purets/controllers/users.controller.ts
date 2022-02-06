import express from 'express';
import {DefaultController} from './default.controller'
import {hash} from 'argon2';
import {returnJson, getCont, dbStore} from '../common/customTypes/types.config'
import passport from 'passport';
import {JwtService} from '../auth/services/jwt.service'

export class UsersController extends DefaultController {

  constructor(svc:string) {
    super(svc)
  }
  static async createInstance() {
    return await Promise.resolve(new UsersController('user'));
  }
  
    signup(self:any) {
      return (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        let db:any=getCont(req.url);
        req.body.password = (async ()=> await hash(req.body.password));

       db.register({ username: req.body.username ,email: req.body.email, password:req.body.password},
       req.body.password, (err:any, user:any) => {
     
        if (err) {
          self.sendJson({ err: err }, 500,res)
        }
        else {
          if (req.body.firstname)
            user.firstname = req.body.firstname;
          if (req.body.lastname)
            user.lastname = req.body.lastname;
          user.save((err:any, user:any) => {
            if (err) {
             self.sendJson({ err: err }, 500,res)
            }
            passport.authenticate('local')(req, res, () => {
              self.sendJson({ success: true, status: 'Registration Successful!' }, 204, res);
            });
          });
        }
      });;
    }}
    
    login(self:any) {
      return (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        // let ddd :any =getCont('/users');
      
      passport.authenticate('local', (err:any, user:any, info:any) => {
        
        if (err)
           next(err);

        if (!user) 
          self.sendJson({success: false, status: 'Login Unsuccessful!', err: info},401,res)  
               
        req.logIn(user, (err) => {
          
          if (err) {
            self.sendJson({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'},401,res)        
          }
    
         // var token = authenticate.getToken({_id: user._id});
         var token = JwtService.generateToken({_id: user._id});

          self.sendJson(({success: true, status: 'Login Successful!', token: token}), 200, res);
        }); 
      }) (req, res, next);
    }
  }

    logout(self:any) {
      return (req: any, res: express.Response, next: express.NextFunction)=>{
      if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
      }else {
        self.sendJson({err:"You are not logged in!"}, 403, res)
      }
    }
    }
    
    facebook(self:any) {
      return (req: any, res: express.Response, next: express.NextFunction)=>{
        
        if (req.user) {
            var token = JwtService.generateToken({_id: req.user._id});
            self.sendJson({success: true, token: token, status: 'You are successfully logged in!'}, 204, res);
        }
      }
    }
    
    create(self:any) {
      return (req: express.Request, res: express.Response, next: express.NextFunction)=> {
        req.body.password = (async ()=> await hash(req.body.password));
       self.super.create(req,res,next)
    }
  }

    patch(self:any) {
      return (req: express.Request, res: express.Response, next: express.NextFunction)=> {
        if(req.body.password){
            req.body.password = ( async ()=> await hash(req.body.password));
        }
       self.super.patch(req,res,next);
    }
  }

  put(self:any) {
    return (req: express.Request, res: express.Response, next: express.NextFunction)=> {
        req.body.password = (async()=> await hash(req.body.password));
       self.super.put(req,res,next);
    }
  }

    checkJWTtoken(self:any){
      return (req:any, res:any, next:any)=>{
      passport.authenticate('jwt', {session: false}, (err:any, user:any, info:any) => {
        if (err)
           next(err);
        
        if (!user) {
          self.sendJson({status: 'JWT invalid!', success: false, err: info}, 401,res);
        }
        else {
          self.sendJson({status: 'JWT valid!', success: true, user: user}, 200, res);
    
        }
      }) (req, res, next);
    }
    };
    // helper
    async getUserByEmail(email: string, self:any) {
        return self.First({email: email});
    }
}

  
 


