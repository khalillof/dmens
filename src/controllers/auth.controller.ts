import express from 'express';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
import {DefaultController} from './default.controller'
import {returnJson} from '../common/customTypes/types.config'
// todo: move to a secure place
const jwtSecret = 'My!@!Se3cr8tH4sh';
const tokenExpirationInSeconds = 36000;

export class AuthController extends DefaultController {

    constructor(){
        super()
    }
    async createJWT(req: express.Request, res: express.Response) {
        try {
            let refreshId = req.body._id + jwtSecret;
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            let token = jwt.sign(req.body, jwtSecret, {expiresIn: tokenExpirationInSeconds});
            let b = Buffer.from(hash);
            let refreshToken = b.toString('base64');
            return returnJson({accessToken: token, refreshToken: refreshToken},201,res);
        } catch (err) {
            return returnJson(err,500, res);
        }
    }
}

//export default new AuthController();
