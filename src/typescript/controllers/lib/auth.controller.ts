import express from 'express';

import {randomBytes, createHmac} from 'crypto';
import { sign } from 'jsonwebtoken';
import { DefaultController } from './default.controller';
import { config } from '../../common';

export class AuthController extends DefaultController {

    constructor(svc:string) {
        super(svc)
    }

    createJWT(req:express.Request, res:express.Response, next:express.NextFunction){

            let refreshId = req.body._id + config.jwtSecret;
            let salt = randomBytes(16).toString('base64');
            let hash = createHmac('sha512', salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            let token = sign(req.body,config.jwtSecret, { expiresIn: 36000, issuer:config.issuer, audience:config.audience });
            let b = Buffer.from(hash);
            let refreshToken = b.toString('base64');
            return res.json({success:true, accessToken: token, refreshToken: refreshToken });
    }
}

