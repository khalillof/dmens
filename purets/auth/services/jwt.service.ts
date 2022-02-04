import passport from 'passport';
import * as FacebookTokenStrategy  from 'passport-facebook-token';
import {Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt} from 'passport-jwt';
import * as jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import {config} from "../../bin/config";
import {dbStore, SvcStore} from '../../common/customTypes/types.config'


////////////////////////
export class JwtService{
  //readonly db: Model;
  constructor(){
      
  }
    static async createInstance(){
        let jwt = new JwtService()
        return await Promise.resolve(jwt)
    }
    public static generateToken(user: any) {
        try {
            return jwt.sign(user, config.secretKey,{expiresIn: 3600});
        } catch (err) {
            throw err;
        }
    }

    jwtPassport : passport.PassportStatic = passport.use(new JwtStrategy({
        jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey : config.secretKey
    },
        (jwt_payload: any, done: any) => {
            let db =dbStore['User'];
            console.log("JWT payload: ", jwt_payload);
            db.findOne({_id: jwt_payload._id}, (err: any, user: any) => {
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
    

    verifyUser: any = passport.authenticate('jwt', {session: false});
    // facebook
    facebookPassport = passport.use(new FacebookTokenStrategy.default({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    }, (accessToken : any, refreshToken: any, profile: any, done:any) => {
        let db =dbStore['User'];
        db.findOne({facebookId: profile.id}, (err:any, user:any) => {
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
                user.save((err: any, user: any) => {
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