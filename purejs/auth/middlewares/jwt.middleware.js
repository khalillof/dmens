"use strict";
const {verify} = require( 'jsonwebtoken');
const {createHmac} = require('crypto');
const {config} = require('../../bin/config')


class JwtMiddleware {

   static async getInstance() {
        return await Promise.resolve(new JwtMiddleware());
    }
    verifyRefreshBodyField(self){
        return (req, res, next) =>{
        if (req.body && req.body.refreshToken) {
            next();
        }
        else {
            self.sendJson({ error: 'need body field: refreshToken' }, 400, res);
        }
    }
}
    validRefreshNeeded(self){
        return (req, res, next) => {
        let b = Buffer.from(req.body.refreshToken, 'base64');
        let refreshToken = b.toString();
        let hash = createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + config.jwtSecret).digest("base64");
        if (hash === refreshToken) {
            delete req.jwt.iat;
            delete req.jwt.exp;
            req.body = req.jwt;
            return next();
        }
        else {
            self.sendJson({ error: 'Invalid refresh token' }, 400, res);
        }
    }
}
    validJWTNeeded(self){
        return (req, res, next) =>{
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    self.sendJson({ error: 'need: refreshToken' }, 401, res);
                }
                else {
                    req.jwt = verify(authorization[1], config.jwtSecret);
                    next();
                }
            }
            catch (err) {
                self.sendJson({ error: 'error' }, 403, res);
            }
        }
        else {
            self.sendJson({ error: 'need body field: refreshToken' }, 401, res);
        }
    }
    }
}
exports.JwtMiddleware = JwtMiddleware;