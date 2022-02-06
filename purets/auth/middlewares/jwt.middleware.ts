import express from 'express';
import {verify} from 'jsonwebtoken';
import {createHmac} from 'crypto';
import {config} from '../../bin/config';

export class JwtMiddleware {
    static async getInstance() {
        return await Promise.resolve(new JwtMiddleware());
    }

    verifyRefreshBodyField(self:any){
        return (req: express.Request, res: express.Response, next: express.NextFunction)=> {
        if (req.body && req.body.refreshToken) {
             next();
        } else {
            self.sendJson({error: 'need body field: refreshToken'}, 400,res);
        }
    }
    };

    validRefreshNeeded(self:any){
        return (req: any, res: express.Response, next: express.NextFunction)=>{
        let b = Buffer.from(req.body.refreshToken, 'base64');
        let refreshToken = b.toString();
        let hash = createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + config.jwtSecret).digest("base64");
        if (hash === refreshToken) {
            delete req.jwt.iat;
            delete req.jwt.exp;
            req.body = req.jwt;
            return next();
        } else {
            self.sendJson({error: 'Invalid refresh token'}, 400,res);
        }
    }
    };

    validJWTNeeded(self:any){
        return (req: any, res: express.Response, next: express.NextFunction)=> {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                     self.sendJson({error: 'need: refreshToken'}, 401,res);
                } else {
                    req.jwt = verify(authorization[1], config.jwtSecret);
                    next();                   
                }

            } catch (err) {
                self.sendJson({error: 'error'}, 403,res);
            }
        } else {
            self.sendJson({error: 'need body field: refreshToken'}, 401,res);
        }
    }
    };
}