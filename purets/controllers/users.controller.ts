import express from 'express';
import {DefaultController} from './default.controller'
import argon2 from 'argon2';
import {returnJson, getCont, dbStore} from '../common/customTypes/types.config'
import passport from 'passport';
import {JwtService} from '../auth/services/jwt.service'

export class UsersController extends DefaultController {

  constructor(){
    super('user')
}
public static async createInstance(){
    var result = new UsersController();
    if(!result.svc){
      result.setDb('user')
    }
  return  await Promise.resolve(result);
}
  
    async signup(req: express.Request, res: express.Response, next: express.NextFunction){
        let db:any=getCont(req.url);
        req.body.password = await argon2.hash(req.body.password);

       await db.register({ username: req.body.username ,email: req.body.email, password:req.body.password},
       req.body.password, (err:any, user:any) => {
     
        if (err) {
          returnJson({ err: err }, 500,res)
        }
        else {
          if (req.body.firstname)
            user.firstname = req.body.firstname;
          if (req.body.lastname)
            user.lastname = req.body.lastname;
          user.save((err:any, user:any) => {
            if (err) {
             returnJson({ err: err }, 500,res)
            }
            passport.authenticate('local')(req, res, () => {
              returnJson({ success: true, status: 'Registration Successful!' }, 204, res);
            });
          });
        }
      });;
    }
    async login(req: express.Request, res: express.Response, next: express.NextFunction){
        // let ddd :any =getCont('/users');
      
      passport.authenticate('local', (err:any, user:any, info:any) => {
        
        if (err)
           next(err);

        if (!user) 
          returnJson({success: false, status: 'Login Unsuccessful!', err: info},401,res)  
               
        req.logIn(user, (err) => {
          
          if (err) {
            returnJson({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'},401,res)        
          }
    
         // var token = authenticate.getToken({_id: user._id});
         var token = JwtService.generateToken({_id: user._id});

          returnJson(({success: true, status: 'Login Successful!', token: token}), 200, res);
        }); 
      }) (req, res, next);
    };
    async logout(req: any, res: express.Response, next: express.NextFunction){
      if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
      }else {
        returnJson({err:"You are not logged in!"}, 403, res)
      }
    }
    async facebook(req: any, res: express.Response, next: express.NextFunction){
        
        if (req.user) {
            var token = JwtService.generateToken({_id: req.user._id});
            returnJson({success: true, token: token, status: 'You are successfully logged in!'}, 204, res);
        }
    }
    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.password = await argon2.hash(req.body.password);
       await super.create(req,res,next)
    }

    async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
        if(req.body.password){
            req.body.password = await argon2.hash(req.body.password);
        }
       await super.patch(req,res,next);
    }

    async put(req: express.Request, res: express.Response, next:express.NextFunction) {
        req.body.password = await argon2.hash(req.body.password);
       await super.put(req,res,next);
    }

    async checkJWTtoken(req:any, res:any, next:any){
      passport.authenticate('jwt', {session: false}, (err:any, user:any, info:any) => {
        if (err)
           next(err);
        
        if (!user) {
          returnJson({status: 'JWT invalid!', success: false, err: info}, 401,res);
        }
        else {
          returnJson({status: 'JWT valid!', success: true, user: user}, 200, res);
    
        }
      }) (req, res, next);
    };
    // helper
    async getUserByEmail(email: string) {
        return await dbStore['User'].findOne({email: email});
    }
}

  
 


