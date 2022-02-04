
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const {sign} =require('jsonwebtoken');
const { randomBytes, createHmac } =require('crypto');
const {DefaultController} =require('./default.controller');
const {getSvc, returnJson} =require('../common/customTypes/types.config');
// todo: move to a secure place
const jwtSecret = 'My!@!Se3cr8tH4sh';
const tokenExpirationInSeconds = 36000;

class AuthController extends DefaultController {

    constructor(svc){
        super(svc)
    }
    
     static async createInstance(){
        var result = new AuthController('/users');
      return  await Promise.resolve(result);
    }
    async createJWT(req, res) {
        try {
            let refreshId = req.body._id + jwtSecret;
            let salt = randomBytes(16).toString('base64');
            let hash = createHmac('sha512', salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            let token = sign(req.body, jwtSecret, {expiresIn: tokenExpirationInSeconds});
            let b = Buffer.from(hash);
            let refreshToken = b.toString('base64');
            return returnJson({accessToken: token, refreshToken: refreshToken},201,res);
        } catch (err) {
            return returnJson(err,500, res);
        }
    }
}

exports.AuthController = AuthController;
