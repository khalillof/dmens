"use strict";

const passport = require( 'passport');
const  {sign} = require('jsonwebtoken'); // used to create, sign, and verify tokens
const {config} = require( "../../common");


class AuthService{

    static generateToken(user) {
        try {
              const body = { _id: user._id, email: user.email };
              const token = sign({ user: body },config.secretKey,{expiresIn: 3600});
            return token;
        } catch (err) {
            throw err;
        }
    }

   //static authenticateUser() {return passport.authenticate('jwt', {session: false});}
    // facebook
   //static authenticateFacebook() {return passport.authenticate('facebook-token');}

  //type = 'local' || 'jwt'|| 'facebook-token'
   static authenticate(type,option, cb) { 
     return async (req,res,next)=>{
     return await passport.authenticate(type,option,cb)(req,res,next);
    }
  }
}
exports.AuthService = AuthService;