import express from 'express';

import {randomBytes, createHmac} from 'crypto';
import { sign } from 'jsonwebtoken';
import { DefaultController } from './default.controller';
import { JwtMiddleware } from '../../auth/middlewares/jwt.middleware';
import { config } from '../../bin/config';

export class AuthController extends DefaultController {

    jwtMWare: JwtMiddleware;
    constructor(svc:string) {
        super(svc)
        this.jwtMWare = new JwtMiddleware();
    }

    static async createInstance() {
        return await Promise.resolve(new AuthController('user'));
    }

    createJWT(req:express.Request, res:express.Response, next:express.NextFunction){
        try {
            let refreshId = req.body._id + config.jwtSecret;
            let salt = randomBytes(16).toString('base64');
            let hash = createHmac('sha512', salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            let token = sign(req.body,config.jwtSecret, { expiresIn: 36000 });
            let b = Buffer.from(hash);
            let refreshToken = b.toString('base64');
            return res.json({success:true, accessToken: token, refreshToken: refreshToken });

        } catch (err) {
            return res.json({ success:false, error:err});
        }
    }
}

