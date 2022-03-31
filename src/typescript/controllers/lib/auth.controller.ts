import express from 'express';
import { DefaultController } from './default.controller';
import { dbStore, config} from '../../common';
import { isExpiredToken,generateGwt, verify, createRefershToken } from '../../services';

export class AuthController extends DefaultController {

    constructor(svc:string) {
        super(svc)
    }

     // check both Bearer tokens accessToken and refeshToken and return both new tokens;
      async  checkAccessRefershTokensAndCreate(req: express.Request, res: express.Response, next: express.NextFunction) {
        let token = req.headers["x-access-token"];
        let refersh_token = req.body["refersh-token"];
      
        // check access token
        if(!token || typeof token !== 'string'){
          return this.responce(res).errStatus(403, "No access token provided!");
        }
        //check refersh token
        if(!refersh_token || typeof refersh_token !== 'string'){
          return this.responce(res).errStatus(403,"No valid referesh token provided!" );
        }
      
        verify(token, config.jwtSecret,async (err:any, user:any) => {
          // prcess if token expired
          if (err) {
            if(err.name === 'TokenExpiredError' || err.message === 'jwt expired'){
             
            await this.check_refresh_create_tokens(user,refersh_token,res);
            //return logger.resErr(res,err)
            }else{
              return this.responce(res).errStatus(403, "not authorized need to sigin!");
            }
          }else{
            // process if token still valid
            await this.check_refresh_create_tokens(user,refersh_token,res);
            return;
          }
        });
      
      };

    private  async  check_refresh_create_tokens(user:any,refersh_token:string, res:express.Response){
        let db_refToken = await dbStore['token'].model?.findOne({ owner: user._id, token:refersh_token});
        if(db_refToken && !isExpiredToken(db_refToken.token)){
             let neRefersh_token = await createRefershToken(user);
             let newSccessToken = generateGwt(user);
             res.json({ success: true, message: "Authentication successful", accessToken: newSccessToken, refershToken: neRefersh_token });
             // update delete old token
             await dbStore['token'].deleteById(db_refToken._id)
             return;
        }else{
          return this.responce(res).errStatus(403,"not authorized need to sigin!");
        }
      }  
      /*
      Refresh Token Automatic Reuse Detection
Refresh tokens are bearer tokens. It's impossible for the authorization server to know who is legitimate or malicious when receiving a new access token request. We could then treat all users as potentially malicious.

How could we handle a situation where there is a race condition between a legitimate user and a malicious one? For example:

🐱 Legitimate User has 🔄 Refresh Token 1 and 🔑 Access Token 1.

😈 Malicious User manages to steal 🔄 Refresh Token 1 from 🐱 Legitimate User.

🐱 Legitimate User uses 🔄 Refresh Token 1 to get a new refresh-access token pair.

The 🚓 Auth0 Authorization Server returns 🔄 Refresh Token 2 and 🔑 Access Token 2 to 🐱 Legitimate User.

😈 Malicious User then attempts to use 🔄 Refresh Token 1 to get a new access token. Pure evil!

What do you think should happen next? Would 😈 Malicious User manage to get a new access token?

This is what happens when your identity platform has 🤖 Automatic Reuse Detection:

The 🚓 Auth0 Authorization Server has been keeping track of all the refresh tokens descending from the original refresh token. That is, it has created a "token family".

The 🚓 Auth0 Authorization Server recognizes that someone is reusing 🔄 Refresh Token 1 and immediately invalidates the refresh token family, including 🔄 Refresh Token 2.

The 🚓 Auth0 Authorization Server returns an Access Denied response to 😈 Malicious User.

🔑 Access Token 2 expires, and 🐱 Legitimate User attempts to use 🔄 Refresh Token 2 to request a new refresh-access token pair.

The 🚓 Auth0 Authorization Server returns an Access Denied response to 🐱 Legitimate User.

The 🚓 Auth0 Authorization Server requires re-authentication to get new access and refresh tokens.

It's critical for the most recently-issued refresh token to get immediately invalidated when a previously-used refresh token is sent to the authorization server. This prevents any refresh tokens in the same token family from being used to get new access tokens.
      */
    
}

