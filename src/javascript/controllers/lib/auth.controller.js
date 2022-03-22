"use strict";
const { DefaultController } = require('./default.controller');
const {randomBytes, createHmac} =require('crypto');
const { sign } =require('jsonwebtoken');
const { config } =require('../../common');
class AuthController extends DefaultController {

    constructor(svc) {
        super(svc)
    }

    createJWT(req, res, next){
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

exports.AuthController=  AuthController;
