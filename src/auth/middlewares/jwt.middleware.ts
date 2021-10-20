import express from 'express';
import {returnJson} from '../../common/customTypes/types.config'
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// todo: remove-me
const jwtSecret = 'My!@!Se3cr8tH4sh';

export class JwtMiddleware {
    private static instance: JwtMiddleware;

    static getInstance() {
        if (!JwtMiddleware.instance) {
            JwtMiddleware.instance = new JwtMiddleware();
        }
        return JwtMiddleware.instance;
    }

    verifyRefreshBodyField(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.refreshToken) {
             next();
        } else {
            returnJson({error: 'need body field: refreshToken'}, 400,res);
        }
    };

    validRefreshNeeded(req: any, res: express.Response, next: express.NextFunction) {
        let b = Buffer.from(req.body.refreshToken, 'base64');
        let refreshToken = b.toString();
        let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + jwtSecret).digest("base64");
        if (hash === refreshToken) {
            delete req.jwt.iat;
            delete req.jwt.exp;
            req.body = req.jwt;
            return next();
        } else {
            returnJson({error: 'Invalid refresh token'}, 400,res);
        }
    };

    validJWTNeeded(req: any, res: express.Response, next: express.NextFunction) {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                     returnJson({error: 'need: refreshToken'}, 401,res);
                } else {
                    req.jwt = jwt.verify(authorization[1], jwtSecret);
                    next();                   
                }

            } catch (err) {
                returnJson({error: 'error'}, 403,res);
            }
        } else {
            returnJson({error: 'need body field: refreshToken'}, 401,res);
        }

    };
}