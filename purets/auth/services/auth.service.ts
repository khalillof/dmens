import passport from 'passport';
import {sign} from 'jsonwebtoken'; // used to create, sign, and verify tokens
import {config} from "../../bin/config";

export class AuthService{

    static generateToken(user:any) {
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