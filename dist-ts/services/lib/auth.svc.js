"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUUID = exports.isExpiredToken = exports.createRefershToken = exports.verify = exports.validateJWT = exports.authenticateJwt = exports.authenticateLocal = exports.generateJwt = void 0;
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const index_js_1 = require("../../common/index.js");
const index_js_2 = require("../../services/index.js");
const crypto_1 = require("crypto");
Object.defineProperty(exports, "randomUUID", { enumerable: true, get: function () { return crypto_1.randomUUID; } });
const { verify, sign, TokenExpiredError } = jsonwebtoken_1.default;
exports.verify = verify;
function getExpiredAt(refersh) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + (refersh ? index_js_1.envs.jwtRefreshExpiration() : index_js_1.envs.jwtExpiration()));
    return expiredAt;
}
const extractors = {
    fromHeader: function (header_name) {
        return function (request) {
            var token = null;
            if (request.headers[header_name]) {
                token = request.headers[header_name];
            }
            return token;
        };
    },
    fromBodyField: function (field_name) {
        return function (request) {
            var token = null;
            if (request.body && Object.prototype.hasOwnProperty.call(request.body, field_name)) {
                token = request.body[field_name];
            }
            return token;
        };
    }
};
function generateJwt(user) {
    try {
        //console.log('jwtExpiration: '+config.jwtExpiration())
        const body = { _id: user._id, email: user.email };
        const accessTokenExpireAt = getExpiredAt().getTime();
        const ops = { expiresIn: index_js_1.envs.jwtExpiration(), issuer: index_js_1.envs.issuer(), audience: index_js_1.envs.audience() };
        const accessToken = sign({ user: body }, index_js_1.envs.secretKey(), ops);
        return { accessToken, accessTokenExpireAt };
    }
    catch (err) {
        throw err;
    }
}
exports.generateJwt = generateJwt;
//type = 'local' || 'jwt'|| 'facebook' || 'facebook-token'
async function authenticateLocal(req, res, next) {
    try {
        return await passport_1.default.authenticate("local", {}, async (err, user, info) => {
            if (user) {
                console.log('authenticated user id local :\n', user._id);
                delete user['hash'];
                delete user['salt'];
                // handle local login
                return await reqLogin(user, { session: true }, true)(req, res, next);
            }
            else {
                // 
                if ((info || err) instanceof TokenExpiredError) {
                    let _refToken = req.headers['refreshToken'];
                    if (!_refToken) {
                        return (0, index_js_1.responce)(res).badRequest('No refersh token! provided :' + String(info || err));
                    }
                    // refresh token found in header
                    let refUser = await index_js_2.Store.db.get('account').findOne({ refreshToken: _refToken });
                    if (!refUser) {
                        return (0, index_js_1.responce)(res).badRequest('refresh token provided not found');
                    }
                    // user found check refresh token is valid
                    if (isExpiredToken(refUser.refreshToken_expireAt)) {
                        return (0, index_js_1.responce)(res).unAuthorized('expired refersh token! require sign in');
                    }
                    // valid refresh token was found next generate new access token only and let them access next()
                    return await reqLogin(refUser, { session: true })(req, res, next);
                }
                else if (err) {
                    return (0, index_js_1.responce)(res).badRequest((err.message ?? err));
                }
                else if (info) {
                    return (0, index_js_1.responce)(res).badRequest((info.message ?? info));
                }
                else {
                    return (0, index_js_1.responce)(res).badRequest();
                }
            }
        })(req, res, next); // end of passport authenticate
    }
    catch (err) {
        index_js_1.logger.resErr(res, (err.message ?? err));
    }
}
exports.authenticateLocal = authenticateLocal;
async function authenticateJwt(req, res, next) {
    return await passport_1.default.authenticate("jwt", {}, async (err, user, info) => {
        //console.log('user id jwt ......', {err,user, info})
        if (user) {
            req.user = user;
            console.log('user id jwt ......', user._id);
            return next();
        }
        else {
            // 
            if ((info || err) instanceof TokenExpiredError) {
                let _refToken = req.headers['refreshToken'];
                if (!_refToken) {
                    return (0, index_js_1.responce)(res).badRequest('No refersh token! provided :' + String(info || err));
                }
                // refresh token found in header
                let refUser = await index_js_2.Store.db.get('account').findOne({ refreshToken: _refToken });
                if (!refUser) {
                    return (0, index_js_1.responce)(res).badRequest('refresh token provided not found');
                }
                // user found check refresh token is valid
                if (isExpiredToken(refUser.refreshToken_expireAt)) {
                    return (0, index_js_1.responce)(res).unAuthorized('expired refersh token! require sign in');
                }
                next();
                // valid refresh token was found next generate new access token only and let them access next()
                // return await reqLogin(refUser, loginOptions)(req, res, next)
            }
            else if (err) {
                return (0, index_js_1.responce)(res).badRequest((err.message ?? err));
            }
            else if (info) {
                return (0, index_js_1.responce)(res).badRequest((info.message ?? info));
            }
            else {
                return (0, index_js_1.responce)(res).badRequest();
            }
        }
    })(req, res, next); // end of passport authenticate 
}
exports.authenticateJwt = authenticateJwt;
async function Tokens(user, access = true, refresh = false) {
    // generate json token
    let token = generateJwt(user);
    // update user with new refresh token
    if (refresh)
        await createRefershToken(user);
    return token;
}
function reqLogin(user, options = { session: false }, both_tokens_required = false) {
    return async (req, res, next) => {
        return req.login(user, options, async (err) => {
            if (err) {
                index_js_1.logger.err(err);
                return (0, index_js_1.responce)(res).badRequest(err.message);
            }
            else if (both_tokens_required) {
                // generate json token, usually when then first sign in to get both access and refresh tokens
                let _tokens = await Tokens(user, true, true);
                return res.json({ success: true, user: user, tokens: _tokens });
            }
            else {
                // issue accessToken base on valid refresh token and grant them access to resource next()
                let access = generateJwt(user);
                res.setHeader('Authorization', 'Bearer ' + access.accessToken);
                res.setHeader('accessTokenExpireAt', access.accessTokenExpireAt);
                return next();
            }
        });
    };
}
// no need for this function just use authenticateUser('jwt)
function validateJWT(req, res, next) {
    verify(req.token, index_js_1.envs.jwtSecret(), function (err, decoded) {
        if (err) {
            /*
              err = {
                name: 'TokenExpiredError',
                message: 'jwt expired',
                expiredAt: 1408621000
              }
            */
            index_js_1.logger.resErr(res, err);
        }
        // next function token is valid
        next();
    });
}
exports.validateJWT = validateJWT;
async function getUUID() {
    let id = (0, crypto_1.randomUUID)();
    return await Promise.resolve(id);
}
async function createRefershToken(user) {
    if (!user) {
        throw new Error('user object is required');
    }
    let expireAt = getExpiredAt(true);
    let _token = await getUUID();
    await index_js_2.Store.db.get('account').putById(user._id, {
        refreshToken: _token,
        refreshTokenExpireAt: expireAt,
    });
    console.log('created Refersh Token : \n' + _token);
    return user;
}
exports.createRefershToken = createRefershToken;
function isExpiredToken(expiryat) {
    return expiryat.getTime() < new Date().getTime();
}
exports.isExpiredToken = isExpiredToken;
