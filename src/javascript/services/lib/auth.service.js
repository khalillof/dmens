"use strict";

const passport = require( 'passport');
const  {sign, verify} = require('jsonwebtoken'); // used to create, sign, and verify tokens
const {config} = require( "../../common");



    function generateGwt(user,expires=3600 ) {
        try {
              const body = { _id: user._id, email: user.email };
              const ops = { expiresIn: expires, issuer: config.issuer, audience:config.audience };
              const token = sign({ user: body },config.secretKey,ops);
            return token;
        } catch (err) {
            throw err;
        }
    }

  //type = 'local' || 'jwt'|| 'facebook-token'
  function authenticateUser(type, opts) {
    return async (req, res, next) => {
      let loginOptions = { session: false };
      let option = type === "jwt" ? loginOptions : {};
      try {
        return await passport.authenticate(type, opts ?? option, async (err, user, info) => {
          if (user) {
            // handle local login
            if (type === 'local') {
              return await reqLogin(user,loginOptions,true)(req,res,next)
            } else {
                // all other type like jwt | facebook
              return  await reqLogin(user,loginOptions)(req,res,next)
            }

          } else if (err || info) {
            let er = err ? err : info;
            console.error(er.stack);

            return res.json({ success: false, error: er.message });

          }
        })(req, res, next); // end of passport authenticate

      } catch (err) {
        res.json({ success: false, error: err })
        console.error(err.stack);
      }
    }
  
}

function reqLogin(user, options={session:false}, tokenRequired=false){
 return async (req, res, next)=>{
  return req.login(user, options, async (err) => {
    if (err) {
      return res.json({ success: false, error: err })
    } else if(tokenRequired){
      // generate json token
      let token = generateGwt(user);
      return res.json({ success: true, message: "Authentication successful", token: token });
      }else{
      return  next()
      }
  });
}
}

    // no need for this function just use authenticateUser('jwt)
   function validateJWT(req, res, next){
    verify(req.token, config.jwtSecret, function(err, decoded) {
      if (err) {
        /*
          err = {
            name: 'TokenExpiredError',
            message: 'jwt expired',
            expiredAt: 1408621000
          }
        */
          res.json({ success: false, error: err.message })
        }
         // next function token is valid
    next()
    });
   }

module.exports ={generateGwt,authenticateUser, validateJWT};