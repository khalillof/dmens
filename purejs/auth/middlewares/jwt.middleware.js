"use strict";

const {returnJson} = require('../../common/customTypes/types.config')
const {verify} = require( 'jsonwebtoken');
const {createHmac} = require('crypto');

// todo: remove-me
const jwtSecret = 'My!@!Se3cr8tH4sh';
class JwtMiddleware {
   static async getInstance() {
        return await Promise.resolve(new JwtMiddleware());
    }
    verifyRefreshBodyField(req, res, next) {
        if (req.body && req.body.refreshToken) {
            next();
        }
        else {
            returnJson({ error: 'need body field: refreshToken' }, 400, res);
        }
    }
    ;
    validRefreshNeeded(req, res, next) {
        let b = Buffer.from(req.body.refreshToken, 'base64');
        let refreshToken = b.toString();
        let hash = createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + jwtSecret).digest("base64");
        if (hash === refreshToken) {
            delete req.jwt.iat;
            delete req.jwt.exp;
            req.body = req.jwt;
            return next();
        }
        else {
            returnJson({ error: 'Invalid refresh token' }, 400, res);
        }
    }
    ;
    validJWTNeeded(req, res, next) {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    returnJson({ error: 'need: refreshToken' }, 401, res);
                }
                else {
                    req.jwt = verify(authorization[1], jwtSecret);
                    next();
                }
            }
            catch (err) {
                returnJson({ error: 'error' }, 403, res);
            }
        }
        else {
            returnJson({ error: 'need body field: refreshToken' }, 401, res);
        }
    }
}
exports.JwtMiddleware = JwtMiddleware;