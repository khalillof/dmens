"use strict";
const { sign } = require('jsonwebtoken');
const { randomBytes, createHmac } = require('crypto');
const { DefaultController } = require('./default.controller');
const { AuthMiddleware } = require('../auth/middlewares/auth.middleware');
const { JwtMiddleware } = require('../auth/middlewares/jwt.middleware');
const { config } = require('../bin/config');
class AuthController extends DefaultController {

    constructor(svc) {
        super(svc)
        this.authMWare = new AuthMiddleware();
        this.jwtMWare = new JwtMiddleware();
    }

    static async createInstance() {
        return await Promise.resolve(new AuthController('user'));
    }

    createJWT(self) {
        return (req, res, next) => {
            try {
                let refreshId = req.body._id + config.jwtSecret;
                let salt = randomBytes(16).toString('base64');
                let hash = createHmac('sha512', salt).update(refreshId).digest("base64");
                req.body.refreshKey = salt;
                let token = sign(req.body,config.jwtSecret, { expiresIn: 36000 });
                let b = Buffer.from(hash);
                let refreshToken = b.toString('base64');
                return self.sendJson({ accessToken: token, refreshToken: refreshToken }, 201, res);
            } catch (err) {
                return self.sendJson(err, 500, res);
            }
        }
    }
}

exports.AuthController = AuthController;
