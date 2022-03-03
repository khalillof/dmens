"use strict";
const {verify} = require( 'jsonwebtoken');
const {createHmac} = require('crypto');
const {config} = require('../../bin/config')

class JwtMiddleware {

   static async getInstance() {
        return await Promise.resolve(new JwtMiddleware());
    }
    verifyRefreshBodyField(req, res, next){
        if (req.body && req.body.refreshToken) {
            next();
        }
        else {
            res.json({ success:false, error: 'missing required body fields' });
        }
    }
    validRefreshNeeded(req, res, next){
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
            res.json({success:false, error: 'Invalid token' });
        }
    }

    validJWTNeeded(req, res, next){
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    res.json({ success:false, error: 'need refreshToken' });
                }
                else {
                    req.jwt = verify(authorization[1], config.jwtSecret);
                    next();
                }
            }
            catch (err) {
                console.error(err.stack)
                res.status(500).json({ success:false,error: 'server error' });
            }
        }
        else {
            res.json({ success:false, error: 'missing required body fields' });
        }
    }
}
exports.JwtMiddleware = JwtMiddleware;