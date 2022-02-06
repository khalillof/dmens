import express from 'express';

import {randomBytes, createHmac} from 'crypto';
import { sign } from 'jsonwebtoken';
import { DefaultController } from './default.controller';
import { AuthMiddleware } from '../auth/middlewares/auth.middleware';
import { JwtMiddleware } from '../auth/middlewares/jwt.middleware';
import { config } from '../bin/config';

export class AuthController extends DefaultController {
    authMWare: AuthMiddleware;
    jwtMWare: JwtMiddleware;
    constructor(svc:string) {
        super(svc)
        this.authMWare = new AuthMiddleware();
        this.jwtMWare = new JwtMiddleware();
    }

    static async createInstance() {
        return await Promise.resolve(new AuthController('user'));
    }

    createJWT(self:any) {
        return (req: express.Request, res: express.Response)=> {
        try {
            let refreshId = req.body._id + config.jwtSecret;
            let salt = randomBytes(16).toString('base64');
            let hash = createHmac('sha512', salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            let token = sign(req.body, config.jwtSecret, {expiresIn: 36000});
            let b = Buffer.from(hash);
            let refreshToken = b.toString('base64');
            return self.sendJson({accessToken: token, refreshToken: refreshToken},201,res);
        } catch (err) {
            return self.sendJson(err,500, res);
        }
    }
}
}

