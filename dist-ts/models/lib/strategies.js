"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportStrategies = void 0;
const tslib_1 = require("tslib");
const passport_jwt_1 = require("passport-jwt");
const index_js_1 = require("../../common/index.js");
const index_js_2 = require("../../services/index.js");
const passport_local_1 = require("passport-local");
const passport_azure_ad_1 = require("passport-azure-ad");
const az_config_json_1 = tslib_1.__importDefault(require("./az-config.json"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const azOptions = {
    identityMetadata: `https://ktuban.b2clogin.com/ktuban.onmicrosoft.com/${az_config_json_1.default.policies.policyName}/${az_config_json_1.default.metadata.version}/${az_config_json_1.default.metadata.discovery}`,
    clientID: az_config_json_1.default.credentials.clientID,
    audience: az_config_json_1.default.credentials.clientID,
    policyName: az_config_json_1.default.policies.policyName,
    isB2C: az_config_json_1.default.settings.isB2C,
    validateIssuer: az_config_json_1.default.settings.validateIssuer,
    loggingLevel: az_config_json_1.default.settings.loggingLevel,
    passReqToCallback: az_config_json_1.default.settings.passReqToCallback
};
class PassportStrategies {
    // local 
    static LocalDefault() {
        return new passport_local_1.Strategy(verifyPasswordSafe);
    }
    static Local2() {
        return new passport_local_1.Strategy(function (username, password, cb) {
            index_js_2.Store.db.get('account').model.findOne({ username: username }).then((user) => {
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
    static azBearerStrategy = () => new passport_azure_ad_1.BearerStrategy(azOptions, (payload, done) => {
        // Send user info using the second argument
        let user = { _id: payload.sub, firstname: payload.given_name, lastname: payload.family_name, username: payload.preferred_username, email: payload.preferred_username };
        console.log('az payload:', payload);
        done(false, user);
    });
    // JWT stratigy
    static JwtAuthHeaderAsBearerTokenStrategy() {
        return new passport_jwt_1.Strategy({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: index_js_1.envs.secretKey(),
            issuer: index_js_1.envs.issuer(),
            audience: index_js_1.envs.audience(),
            // passReqToCallback:true
        }, async (payload, done) => {
            // roles populate relaying on autopopulate plugin
            index_js_2.Store.db.get('account').model?.findById(payload.user._id)
                .then((error, user, info) => done(user, error, info));
        });
    }
    // JWT stratigy
    static JwtQueryParameterStrategy() {
        return new passport_jwt_1.Strategy({
            secretOrKey: index_js_1.envs.jwtSecret(),
            issuer: index_js_1.envs.issuer(),
            audience: index_js_1.envs.audience(),
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromUrlQueryParameter('token')
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
        return index_js_1.envs.authStrategy() === 'oauth-bearer' ? PassportStrategies.azBearerStrategy() : PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy();
    }
}
exports.PassportStrategies = PassportStrategies;
//####################################################################
function validPassword(password, hash, salt) {
    var hashVerify = crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
function verifyPasswordSafe(username, password, cb) {
    index_js_2.Store.db.get('account').model.findOne({ username: username }, (err, user) => {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
        crypto_1.default.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                return cb(err);
            }
            if (!crypto_1.default.timingSafeEqual(user.hash, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, user);
        });
    });
}
function genHashedPassword(password) {
    var salt = crypto_1.default.randomBytes(32).toString('hex');
    var genHash = crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: genHash
    };
}
