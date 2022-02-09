"use strict";

const passport = require( 'passport');
const  {sign} = require('jsonwebtoken'); // used to create, sign, and verify tokens
const {config} = require( "../../bin/config");


class AuthService{

    static generateToken(user) {
        try {
              const body = { _id: user._id, email: user.email };
              const token = sign({ user: body },config.secretKey,{expiresIn: 3600});
            return token;
        } catch (err) {
            throw err;
        }
    }

   static authenticateUser = passport.authenticate('jwt', {session: false});
    // facebook
   static authenticateFacebook = passport.authenticate('facebook-token');
}
exports.AuthService = AuthService;