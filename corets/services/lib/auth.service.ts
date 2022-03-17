import passport from 'passport';
import express from 'express'
import {sign} from 'jsonwebtoken'; // used to create, sign, and verify tokens
import {config} from "../../common";

export class AuthService{

    static generateToken(user:any) {
        try {
              const body = { _id: user._id, email: user.email };
              const token = sign({ user: body },config.secretKey,{expiresIn: 3600});
            return token;
        } catch (err) {
            throw err;
        }
    }

    //type = 'local' || 'jwt'|| 'facebook-token'
    static authenticate(type:string,option?:any, cb?:Function | any) { 
      return async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
      return await passport.authenticate(type,option!,cb)(req,res,next);
     }
   }
}