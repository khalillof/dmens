"use strict";
//require('dotenv').config()
Object.defineProperty(exports, "__esModule", { value: true });
const { verify } =require("argon2");
const { getSvc, returnJson } = require("../../common/customTypes/types.config");

class AuthMiddleware {
   static async  getInstance() {
        return Promise.resolve(new AuthMiddleware());
    }
    async validateBodyRequest(req, res, next) {
        if(req.body && req.body.email && req.body.password){
            next();
        }else{
            returnJson({error: 'Missing body fields: email, password'}, 400,res);
        }
    }

    async verifyUserPassword(req, res, next) {
       let db = getSvc('/users');
        await db.getUserByEmail(req.body.email).then(async (user)=>{
        if (user) {
            let passwordHash = user.password;
            if (await verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    provider: 'email',
                    password: passwordHash
                    //permissionLevel: user.permissionLevel,
                };
                next();
            } else {
                returnJson({error: 'Invalid e-mail and/or password'}, 400,res);
            }
        } else {
            returnJson({error: 'Invalid e-mail and/or password'}, 400,res);
        }
    }).catch((err)=> next(err));
    }
}

exports.AuthMiddleware = AuthMiddleware;
