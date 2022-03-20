import passport from 'passport';
import express from 'express'
import { sign } from 'jsonwebtoken'; // used to create, sign, and verify tokens
import { config } from "../../common";

export class AuthService {

  static generateToken(user: any) {
    try {
      const body = { _id: user._id, email: user.email };
      const token = sign({ user: body }, config.secretKey, { expiresIn: 3600 });
      return token;
    } catch (err) {
      throw err;
    }
  }

  //type = 'local' || 'jwt'|| 'facebook-token'
  static authenticate(type: string, option?: any, cb?: Function | any) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      return await passport.authenticate(type, option!, cb)(req, res, next);
    }
  }

  static authenticateUser(type: string, opts?: any) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let sessionFalse = { session: false };
      let option = type === "jwt" ? sessionFalse : {};
      try {
        return await passport.authenticate(type, opts ?? option, (err: any, user: object, info: any) => {

          if (user) {
            // handle local login
            if (type === 'local') {
              return req.login(user, sessionFalse, async (err) => {
                let _user: any = user;
                if (err) {
                  return res.json({ success: false, error: err })
                } else {
                  // generate json token
                  const token = sign({ user: { _id: _user._id, email: _user.email } }, config.secretKey, { expiresIn: 3600 });
                  return res.json({ success: true, message: "Authentication successful", token: token });
                }
              });
            } else {
                // other type like jwt | facebook
                req.login(user,  sessionFalse, async (err)=>{
                  if (err) {
                    return res.json({success:false, error:err})
                  } 
                });
                
                // next function after user is authnicated
                // could be jwt or facebook
              return next();
            }

          } else if (err || info) {
            let er = err ? err : info;
            console.log(er.stack);

            return res.json({ success: false, error: er.message });

          }
        })(req, res, next)
      } catch (err: any) {
        res.json({ success: false, error: err })
        console.error(err.stack);
      }
    }
  }
}