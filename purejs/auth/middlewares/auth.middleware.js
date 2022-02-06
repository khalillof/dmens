"use strict";

const { verify } =require("argon2");

class AuthMiddleware {

   static async  getInstance() {
        return await Promise.resolve(new AuthMiddleware());
    }

    
    validateBodyRequest(userCotroller){
        return(req, res, next)=>{
        if(req.body && req.body.email && req.body.password){
            next();
        }else{
            userCotroller.sendJson({error: 'Missing body fields: email, password'}, 400,res);
        }
    }
}

    verifyUserPassword(userCotroller){
        return (req, res, next) =>{
        userCotroller.getUserByEmail(req.body.email).then(async (user)=>{
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
                userCotroller.sendJson({error: 'Invalid e-mail and/or password'}, 400,res);
            }
        } else {
            userCotroller.sendJson({error: 'Invalid e-mail and/or password'}, 400,res);
        }
    }).catch((err)=> next(err));
    }
}
}

exports.AuthMiddleware = AuthMiddleware;
