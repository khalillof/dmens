import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { envs } from "../../common";
import jwksRsa from 'jwks-rsa';
import mongoose from 'mongoose';

export class PassportStrategies {

  // JWT stratigy
  static async JwtAuthHeaderAsBearerTokenStrategy() {

    return new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.jwtSecret(),
      issuer: envs.issuer(),
      audience: envs.audience(),
      algorithms: ['RS256'],
      passReqToCallback: false
    }, async (payload: any, done: any) => {
      //console.log('payload:\n', payload)
      // roles populate relaying on autopopulate plugin
      mongoose.models['account'].findById(payload.user._id)
        .then((error: any, user?: any, info?: any) => done(user, error, info))
    })
  }

  // JWT stratigy
  static async JwtStrategy() {

      return new JwtStrategy({ 
        //secretOrKey:""
        secretOrKeyProvider: jwksRsa.passportJwtSecret({
          proxy:process.env['JWT_PROXY'],
          cache: true,
          rateLimit: true,
          timeout: 5000, // 30000 // Defaults to 30s,
          jwksRequestsPerMinute: 5,
          jwksUri: envs.jwks_uri()
        }),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  
        // Validate the audience and the issuer.
        audience: envs.audience(),
        issuer: envs.issuer(),
        algorithms: ['RS256']
      }, async (payload: any, done: any) => {
        if (payload) {
          done(null, payload, null)
        } else {
          done("unknown error", false, null)
        }

      })

  }
  // JWT stratigy
  static async JwtQueryParameterStrategy() {
    return new JwtStrategy(
      {
        secretOrKey: envs.jwtSecret(),
        issuer: envs.issuer(),
        audience: envs.audience(),
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token')
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    );
  }

  static async getAuthStrategy() {
    return envs.authStrategy() === 'jwt' ? await PassportStrategies.JwtStrategy() : await PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy(); 
  }
}
