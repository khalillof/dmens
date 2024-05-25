"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeOidc = exports.useOidcStrategy = void 0;
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
const openid_client_1 = require("openid-client");
async function useOidcStrategy() {
    const params = {
        scope: 'openid dmens-api profile email',
        resources: {
            'http://localhost:8000/categories': {
                scope: 'dmens-api profile email'
            }
        }
    };
    const usePKCE = "S256"; // optional, defaults to false, when true the code_challenge_method will be
    // resolved from the issuer configuration, instead of true you may provide
    // any of the supported values directly, i.e. "S256" (recommended) or "plain"
    openid_client_1.Issuer.discover("http://localhost:44382/pauth").then((pIssuer) => {
        console.log('issuer metadata :', pIssuer.metadata);
        const client = new pIssuer.Client({
            client_id: 'dmens-api2',
            client_secret: 'dmens-api2',
            redirect_uris: ["http://localhost:8000/redirect"],
            response_types: ['code']
        });
        passport_1.default.use('oidc', new openid_client_1.Strategy({ client, params, usePKCE, passReqToCallback: true }, (req, tokenSet, userinfo, done) => {
            console.log("tokenSet", tokenSet);
            console.log("userinfo", userinfo);
            // do whatever you want with tokenset and userinfo
            req.session.tokenSet = tokenSet;
            req.session.userinfo = userinfo;
            // return done(null, tokenSet.claims());
            if (userinfo) {
                return done(null, userinfo);
            }
            return done(null, false);
        }));
    }).then(() => console.log('useOidcStrategy initalized.......................!!!')).catch((err) => console.error(err));
}
exports.useOidcStrategy = useOidcStrategy;
;
const authorizeOidc = async (req, res, next) => passport_1.default.authenticate("oidc", {}, async (err, user, info) => res.send({ err, user, info }))(req, res, next);
exports.authorizeOidc = authorizeOidc;
/**
 * reset OidcStrategy
 *
 * @memberof PassportService
 */
function resetOidcStrategy() {
    //debug('OidcStrategy: reset');
    passport_1.default.unuse('oidc');
}
