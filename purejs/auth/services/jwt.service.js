"use strict";

const passport = require( 'passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const {Strategy , ExtractJwt } = require( 'passport-jwt');
const  {sign} = require('jsonwebtoken'); // used to create, sign, and verify tokens
const {config} = require( "../../bin/config");
const {dbStore} = require('../../common/customTypes/types.config');

class JwtService{

    static async createInstance(){
        return await Promise.resolve(new JwtService())
    }
    static generateToken(user) {
        try {
            return sign(user, config.secretKey,{expiresIn: 3600});
        } catch (err) {
            throw err;
        }
    }

    jwtPassport  = passport.use(new Strategy({
        jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey : config.secretKey
    },
        (jwt_payload, done) => {
            let db =dbStore['user'];
            console.log("JWT payload: ", jwt_payload);
            db.findOne({_id: jwt_payload._id}, (err, user) => {
                console.log
                if (err) {
                    return done(err, false);
                }
                else if (user) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });
    }));
    

    verifyUser = passport.authenticate('jwt', {session: false});
    // facebook
    facebookPassport = passport.use(new FacebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        let db =dbStore['user'];
        db.findOne({facebookId: profile.id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (!err && user !== null) {
                return done(null, user);
            }
            else {
                user = { username: profile.displayName };
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.email = profile.email
                user.save((err, user) => {
                    if (err)
                        return done(err, false);
                    else
                        return done(null, user);
                })
            }
        });
    }
    ));
}
exports.JwtService = JwtService;