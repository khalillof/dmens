"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const {DefaultController} = require( './default.controller')
const {hash} = require( 'argon2');
const {returnJson} = require( '../common/customTypes/types.config');
const passport= require('passport');
const {JwtService} = require('../auth/services/jwt.service');

 class UsersController extends DefaultController {

  constructor(svc){
    super(svc)
}
 static async createInstance(){
    var result = new UsersController('/users');
  return  await Promise.resolve(result);
}
  
    async signup(req, res, next){

        req.body.password = await hash(req.body.password);

       await this.register({ username: req.body.username ,email: req.body.email, password:req.body.password},
       req.body.password, (err, user) => {
     
        if (err) {
          returnJson({ err: err }, 500,res)
        }
        else {
          if (req.body.firstname)
            user.firstname = req.body.firstname;
          if (req.body.lastname)
            user.lastname = req.body.lastname;
          user.save((err, user) => {
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
    async login(req, res, next){
        // let ddd :any =getCont('/users');
      
      passport.authenticate('local', (err, user, info) => {
        
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
    async logout(req, res, next){
      if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
      }else {
        returnJson({err:"You are not logged in!"}, 403, res)
      }
    }
    async facebook(req, res, next){
        
        if (req.user) {
            var token = JwtService.generateToken({_id: req.user._id});
            returnJson({success: true, token: token, status: 'You are successfully logged in!'}, 204, res);
        }
    }
    async create(req, res, next) {
        req.body.password = await hash(req.body.password);
       await super.create(req,res,next)
    }

    async patch(req, res, next) {
        if(req.body.password){
            req.body.password = await hash(req.body.password);
        }
       await super.patch(req,res,next);
    }

    async put(req, res, next) {
        req.body.password = await hash(req.body.password);
       await super.put(req,res,next);
    }

    async checkJWTtoken(req, res, next){
      passport.authenticate('jwt', {session: false}, (err, user, info) => {
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
    async getUserByEmail(email) {
        return await getSvc('/users').db.findOne({email: email});
    }
}

exports.UsersController = UsersController;
