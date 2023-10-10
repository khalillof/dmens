import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { envConfig, Svc } from "../../common/index.js";
import { Strategy as LocalStrategy } from 'passport-local';
import { BearerStrategy } from "passport-azure-ad";
import azconfig from './az-config.json' assert { type: 'json' };
import crypto from 'crypto';
const azOptions = {
    identityMetadata: `https://ktuban.b2clogin.com/ktuban.onmicrosoft.com/${azconfig.policies.policyName}/${azconfig.metadata.version}/${azconfig.metadata.discovery}`,
    clientID: azconfig.credentials.clientID,
    audience: azconfig.credentials.clientID,
    policyName: azconfig.policies.policyName,
    isB2C: azconfig.settings.isB2C,
    validateIssuer: azconfig.settings.validateIssuer,
    loggingLevel: azconfig.settings.loggingLevel,
    passReqToCallback: azconfig.settings.passReqToCallback
};
class PassportStrategies {
    // local 
    static LocalDefault() {
        return new LocalStrategy(verifyPasswordSafe);
    }
    static Local2() {
        return new LocalStrategy(function (username, password, cb) {
            Svc.db.get('account').model.findOne({ username: username }).populate('roles').exec().then((user) => {
                if (!user) {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
                // Function defined at bottom of app.js
                const isValid = validPassword(password, user.hash, user.salt);
                if (isValid) {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
                else {
                    return cb(null, user);
                }
            }).catch((err) => cb(err));
        });
    }
    // azure active directory b2c
    static azBearerStrategy = () => new BearerStrategy(azOptions, (payload, done) => {
        // Send user info using the second argument
        let user = { _id: payload.sub, firstname: payload.given_name, lastname: payload.family_name, username: payload.preferred_username, email: payload.preferred_username };
        console.log('az payload:', payload);
        done(false, user);
    });
    // JWT stratigy
    static JwtAuthHeaderAsBearerTokenStrategy() {
        return new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: envConfig.secretKey(),
            issuer: envConfig.issuer(),
            audience: envConfig.audience(),
            // passReqToCallback:true
        }, async (payload, done) => {
            Svc.db.get('account').model?.findById(payload.user._id).populate('roles').exec().then((error, user, info) => {
                return user && done(false, user) || error && done(error, null) || info && done(false, null, info);
            });
        });
    }
    // JWT stratigy
    static JwtQueryParameterStrategy() {
        return new JwtStrategy({
            secretOrKey: envConfig.jwtSecret(),
            issuer: envConfig.issuer(),
            audience: envConfig.audience(),
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token')
        }, async (token, done) => {
            try {
                return done(null, token.user);
            }
            catch (error) {
                done(error);
            }
        });
    }
    static getAuthStrategy() {
        return envConfig.authStrategy() === 'oauth-bearer' ? PassportStrategies.azBearerStrategy() : PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy();
    }
}
export { PassportStrategies };
//####################################################################
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
function verifyPasswordSafe(username, password, cb) {
    Svc.db.get('account').model.findOne({ username: username }, (err, user) => {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                return cb(err);
            }
            if (!crypto.timingSafeEqual(user.hash, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, user);
        });
    });
}
function genHashedPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: genHash
    };
}
