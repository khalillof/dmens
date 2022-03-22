import passport from 'passport';
import express from 'express'
import { sign , verify} from 'jsonwebtoken'; // used to create, sign, and verify tokens
import { config } from "../../common";


  function generateGwt(user: any, expires=3600) {
    try {
      const body = { _id: user._id, email: user.email };
      const ops = { expiresIn: expires, issuer: config.issuer, audience:config.audience };
      const token = sign({ user: body }, config.secretKey,ops );
      return token;
    } catch (err) {
      throw err;
    }
  }

  //type = 'local' || 'jwt'|| 'facebook-token'
  function authenticateUser(type: string, opts?: any) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let loginOptions = { session: false };
      let option = type === "jwt" ? loginOptions : {};
      try {
        return await passport.authenticate(type, opts ?? option, async (err: any, user: object, info: any) => {

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

      } catch (err: any) {
        res.json({ success: false, error: err })
        console.error(err.stack);
      }
    }
}

function reqLogin(user:any, options={session:false}, tokenRequired=false){
 return async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
  return req.login(user, options, async (err:any) => {
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

function validateJWT(req: any, res: express.Response, next: express.NextFunction){
  verify(req.token, config.jwtSecret, function(err:any, decoded:any) {
    if (err) {
      /*
        err = {
          name: 'TokenExpiredError',
          message: 'jwt expired',
          expiredAt: 1408621000
        }
      */
      return  res.json({ success: false, error: err.message })
    }
    // next function token is valid
    next()
  });
 }
export {generateGwt, authenticateUser, validateJWT}