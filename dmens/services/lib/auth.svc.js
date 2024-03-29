import passport from 'passport';
import jwt from 'jsonwebtoken';
import { responce, envs, Svc, logger } from "../../common/index.js";
import { randomUUID } from 'crypto';
const { verify, sign, TokenExpiredError } = jwt;
function getExpiredAt(refersh) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + (refersh ? envs.jwtRefreshExpiration() : envs.jwtExpiration()));
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
        const ops = { expiresIn: envs.jwtExpiration(), issuer: envs.issuer(), audience: envs.audience() };
        const accessToken = sign({ user: body }, envs.secretKey(), ops);
        return { accessToken, accessTokenExpireAt };
    }
    catch (err) {
        throw err;
    }
}
//type = 'local' || 'jwt'|| 'facebook' || 'facebook-token'
async function authenticateLocal(req, res, next) {
    try {
        return await passport.authenticate("local", {}, async (err, user, info) => {
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
                        return responce(res).badRequest('No refersh token! provided :' + String(info || err));
                    }
                    // refresh token found in header
                    let refUser = await Svc.db.get('account').findOne({ refreshToken: _refToken });
                    if (!refUser) {
                        return responce(res).badRequest('refresh token provided not found');
                    }
                    // user found check refresh token is valid
                    if (isExpiredToken(refUser.refreshToken_expireAt)) {
                        return responce(res).unAuthorized('expired refersh token! require sign in');
                    }
                    // valid refresh token was found next generate new access token only and let them access next()
                    return await reqLogin(refUser, { session: true })(req, res, next);
                }
                else if (err) {
                    return responce(res).badRequest((err.message ?? err));
                }
                else if (info) {
                    return responce(res).badRequest((info.message ?? info));
                }
                else {
                    return responce(res).badRequest();
                }
            }
        })(req, res, next); // end of passport authenticate
    }
    catch (err) {
        logger.resErr(res, (err.message ?? err));
    }
}
async function authenticateJwt(req, res, next) {
    return await passport.authenticate("jwt", {}, async (err, user, info) => {
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
                    return responce(res).badRequest('No refersh token! provided :' + String(info || err));
                }
                // refresh token found in header
                let refUser = await Svc.db.get('account').findOne({ refreshToken: _refToken });
                if (!refUser) {
                    return responce(res).badRequest('refresh token provided not found');
                }
                // user found check refresh token is valid
                if (isExpiredToken(refUser.refreshToken_expireAt)) {
                    return responce(res).unAuthorized('expired refersh token! require sign in');
                }
                next();
                // valid refresh token was found next generate new access token only and let them access next()
                // return await reqLogin(refUser, loginOptions)(req, res, next)
            }
            else if (err) {
                return responce(res).badRequest((err.message ?? err));
            }
            else if (info) {
                return responce(res).badRequest((info.message ?? info));
            }
            else {
                return responce(res).badRequest();
            }
        }
    })(req, res, next); // end of passport authenticate 
}
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
                logger.err(err);
                return responce(res).badRequest(err.message);
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
    verify(req.token, envs.jwtSecret(), function (err, decoded) {
        if (err) {
            /*
              err = {
                name: 'TokenExpiredError',
                message: 'jwt expired',
                expiredAt: 1408621000
              }
            */
            logger.resErr(res, err);
        }
        // next function token is valid
        next();
    });
}
async function getUUID() {
    let id = randomUUID();
    return await Promise.resolve(id);
}
async function createRefershToken(user) {
    if (!user) {
        throw new Error('user object is required');
    }
    let expireAt = getExpiredAt(true);
    let _token = await getUUID();
    await Svc.db.get('account').putById(user._id, {
        refreshToken: _token,
        refreshTokenExpireAt: expireAt,
    });
    console.log('created Refersh Token : \n' + _token);
    return user;
}
function isExpiredToken(expiryat) {
    return expiryat.getTime() < new Date().getTime();
}
export { generateJwt, authenticateLocal, authenticateJwt, validateJWT, verify, createRefershToken, isExpiredToken, randomUUID };
