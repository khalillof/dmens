"use strict";

const passport = require( 'passport');
const  {sign, verify} = require('jsonwebtoken'); // used to create, sign, and verify tokens
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

  static  authenticateUser(type, opts){
    return async (req, res, next)=>{
     let sessionFalse = { session: false };
     let option = type === "jwt"? sessionFalse : {};
     try{
     
         return await passport.authenticate(type, opts ?? option,(err,user,info) => {  
          
                  if(user) {
                     // handle local login
                     if (type === 'local'){

                   return req.login(user,  sessionFalse, async (err)=>{
                      if (err) {
                        return res.json({success:false, error:err})
                      } else {
                        // generate json token
                        const token = sign({ user: { _id: user._id, email: user.email } },config.secretKey,{expiresIn: 3600});
                      return  res.json({ success: true, message: "Authentication successful", token: token });
                      }
                    });
                  }else{
                    // other type like jwt | facebook
                    req.login(user,  sessionFalse, async (err)=>{
                      if (err) {
                        return res.json({success:false, error:err})
                      } 
                    });
                    
                    // next function after user is authnicated
                    // could be jwt or facebook
                  return  next();
                  }
                     
                  }else if (err || info) {
                    let er = err ? err : info;
                    console.log(er.stack);

                    return res.json({success:false , error:er.message});
                   }
               
         })(req,res,next)

        }catch(err){
          res.json({success:false,error:err.message})
          console.error(err.stack);
        }
     }
    
    }

    // no need for this function just use authenticateUser('jwt)
   static validJWTBearerToken(req, res, next){
    verify(req.token, 'shhhhh', function(err, decoded) {
      if (err) {
        /*
          err = {
            name: 'TokenExpiredError',
            message: 'jwt expired',
            expiredAt: 1408621000
          }
        */
      }
    });
   }
}
exports.AuthService = AuthService;