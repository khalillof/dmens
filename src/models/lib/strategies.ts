import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { envs } from "../../common/index.js";
import { Store } from '../../services/index.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { BearerStrategy, ITokenPayload } from "passport-azure-ad";
import jwksRsa from 'jwks-rsa';
import azconfig from './az-config.json';
import http from 'node:https';

import crypto from 'crypto';

const azOptions: any = {
  identityMetadata: `https://ktuban.b2clogin.com/ktuban.onmicrosoft.com/${azconfig.policies.policyName}/${azconfig.metadata.version}/${azconfig.metadata.discovery}`,
  clientID: azconfig.credentials.clientID,
  audience: azconfig.credentials.clientID,
  policyName: azconfig.policies.policyName,
  isB2C: azconfig.settings.isB2C,
  validateIssuer: azconfig.settings.validateIssuer,
  loggingLevel: azconfig.settings.loggingLevel,
  passReqToCallback: azconfig.settings.passReqToCallback
}

export class PassportStrategies {


  // azure active directory b2c
  static  azBearerStrategy = async () => new BearerStrategy(azOptions, (payload: ITokenPayload, done: any) => {
    // Send user info using the second argument
    let user = { _id: payload.sub, firstname: payload.given_name, lastname: payload.family_name, username: payload.preferred_username, email: payload.preferred_username }
    console.log('az payload:', payload)
    done(false, user);
  }
  );
  // JWT stratigy
  static async JwtAuthHeaderAsBearerTokenStrategy() {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.jwtSecret(),
      issuer: envs.issuer(),
      audience: envs.audience(),
      algorithms: ['RS256']
    }
    return new JwtStrategy(opts, async (payload: any, done: any) => {
      // roles populate relaying on autopopulate plugin
      Store.db.get('account')!.model?.findById(payload.user._id)
        .then((error: any, user?: any, info?: any) => done(user, error, info))
    })
  }


  // JWT stratigy
  static async JwtStrategy() {
   //let agent = await httpServer(app)
    try {
      const client = jwksRsa({
       // requestAgent: new http.Agent({keepAlive:true,timeout:5000}),
        cache:true,
        jwksUri: envs.jwks_uri(),
        requestHeaders: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers':'Authorization, Origin, X-Requested-With, Content-Type, Accept',
          'Connection': 'Keep-Alive',
          'Keep-Alive': 'timeout=5, max=1000'
        }, // Optional
        timeout: 50000 // Defaults to 30s
      });
      let keys:any = await client.getKeys();

      console.log('kind : ',keys[0].kid)
    

const kid = keys[0].kid;
const key = await client.getSigningKey(kid);
const signingKey = key.getPublicKey();

//throw new Error(' Keys')
 // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
      /*  secretOrKeyProvider: jwksRsa.passportJwtSecret({
          cache: true,
          rateLimit: true,
          timeout: 5000, // 30000 // Defaults to 30s,
          jwksRequestsPerMinute: 5,
          jwksUri: envs.jwks_uri(),
          handleSigningKeyError: (err, cb) => {
            if (err instanceof jwksRsa.SigningKeyNotFoundError) {
              console.error(err)
              return cb(err);
            }
            
            console.error(err)
           return cb(err);
          }
        }),
        */
        
      const jwtOpts = {
       secretOrKey:signingKey,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  
        // Validate the audience and the issuer.
        audience: envs.audience(),
        issuer: envs.issuer(),
        algorithms: ['RS256']
      };
      // done:(error: any, user?: Express.User | false, info?: any)
      return new JwtStrategy(jwtOpts, async (payload: any, done: any) => {
        // console.log('jwt payload :\n',payload)
        // roles populate relaying on autopopulate plugin
        // Store.db.get('account')!.model?.findById(payload.user._id)
        // .then((error: any, user?: any, info?:any)=> done(user,error, info))
        //user.roles =[{name:'admin'}];

        if (payload) {
          done(null, payload, null)
        } else {
          done("unknown error", false, null)
        }

      })
    } catch (err) {
      console.error(err);
      throw err
    }
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
    switch (envs.authStrategy()) {
      case "jwt":
        //return await PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy();
        return await PassportStrategies.JwtStrategy();
      case "oauth-bearer":
        return await PassportStrategies.azBearerStrategy()
      default:
        return await  PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy();

    }
    //return envs.authStrategy() === 'oauth-bearer' ? PassportStrategies.azBearerStrategy() : PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy(); 
  }
}

//####################################################################

function validPassword(password: string, hash: string, salt: any) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}


function verifyPasswordSafe(username: string, password: string, cb: any) {
  Store.db.get('account')!.model!.findOne({ username: username }, (err: any, user: any) => {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hash, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
}

function genHashedPassword(password: string) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  };
}