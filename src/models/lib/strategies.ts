import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';
import { envs, Svc } from "../../common/index.js";
import { Strategy as LocalStrategy } from  'passport-local';
import {BearerStrategy,ITokenPayload} from "passport-azure-ad";
import  azconfig from './az-config.json' assert {type: 'json'};
import crypto from 'crypto';

const  azOptions:any = {
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

   // local 
   static LocalDefault() {
    return new LocalStrategy(verifyPasswordSafe)
  }

  static Local2(){
    return new LocalStrategy(
      function(username, password, cb) {
        Svc.db.get('account')!.model!.findOne({ username: username }).then((user:any) => {
                  if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
                  
                  // Function defined at bottom of app.js
                  const isValid = validPassword(password, user.hash, user.salt);
                  
                  if (isValid) {
                      return cb(null, false, { message: 'Incorrect username or password.' });
                  } else {
                      return cb(null, user);
                  }
              }).catch((err:any)=> cb(err));
  });
  }

  // azure active directory b2c
 static azBearerStrategy = ()=> new BearerStrategy(azOptions, (payload: ITokenPayload, done: any) => {
    // Send user info using the second argument
    let user = {_id:payload.sub, firstname:payload.given_name, lastname:payload.family_name, username:payload.preferred_username,email:payload.preferred_username}
   console.log('az payload:',payload)
    done(false,user);
}
);
  // JWT stratigy
  static JwtAuthHeaderAsBearerTokenStrategy() {
    return new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.secretKey(),
      issuer: envs.issuer(),
      audience: envs.audience(),
     // passReqToCallback:true
    },async (payload:any, done:any) => {
      // roles populate relaying on autopopulate plugin
      Svc.db.get('account')!.model?.findById(payload.user._id)
      .then((error: any, user?: any, info?:any)=> done(user,error, info))
  })}
  // JWT stratigy
  static JwtQueryParameterStrategy() {
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

static getAuthStrategy(){
    return envs.authStrategy() === 'oauth-bearer' ? PassportStrategies.azBearerStrategy() : PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy(); 
  }
}

//####################################################################

function validPassword(password:string, hash:string, salt:any) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}


function verifyPasswordSafe(username:string, password:string, cb:any) {
  Svc.db.get('account')!.model!.findOne({ username: username },(err:any, user:any)=>{
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

function genHashedPassword(password:string) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return {
    salt: salt,
    hash: genHash
  };
}
