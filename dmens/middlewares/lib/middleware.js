import { isValidRole, Svc, responce } from '../../common/index.js';
import { uploadSchema } from '../../routes/index.js';
import fs from 'fs';
import { authenticateJwt } from '../../services/index.js';
class Middlewares {
    async authenticate(req, res, next) {
        return await authenticateJwt(req, res, next);
    }
    async getUserFromReq(req) {
        return req.body && req.body.email ? await Svc.db.get('account').findOne({ email: req.body.email }) : null;
    }
    checkLoginUserFields(req, res, next) {
        if (req.body) {
            let { email, username, password } = req.body;
            if (!username && email) {
                req.body.username = email;
            }
            ;
            if (!email && username) {
                req.body.email = username;
            }
            ;
            if (req.body.email && req.body.password) {
                next();
                return;
            }
        }
        responce(res).badRequest('Missing required body fields');
        return;
    }
    async validateSameEmailDoesntExist(req, res, next) {
        await this.getUserFromReq(req) ? responce(res).badRequest('User email already exists') : next();
    }
    validateCurrentUserOwnParamId(req, res, next) {
        req.user && String(req.user._id) === String(req.params['id']) ? next() : responce(res).unAuthorized();
    }
    validateBodyEmailBelongToCurrentUser(req, res, next) {
        (req.user && req.body.email === req.user.email) ? next() : responce(res).unAuthorized();
    }
    validateHasQueryEmailBelongToCurrentUser(req, res, next) {
        (req.user && req.query.email === req.user.email) ? next() : responce(res).forbidden('not authorized, require valid email');
    }
    async userExist(req, res, next) {
        await this.getUserFromReq(req) ? next() : responce(res).forbidden('User does not exist : ' + req.body.email);
    }
    async uploadSchema(req, res, next) {
        return uploadSchema;
    }
    isAuthenticated(req, res, next) {
        req.user ? next() : responce(res).unAuthorized();
    }
    async isAdmin(req, res, next) {
        if (!req.user) {
            return responce(res).forbidden('require authentication');
        }
        if (req.user.roles) {
            for (let r of req.user.roles) {
                if (r.name === 'admin') {
                    next();
                    return;
                }
            }
        }
        responce(res).forbidden("Require Admin Role!");
        return;
    }
    // roles
    isRolesExist(roles) {
        if (roles) {
            for (let r of roles) {
                if (!isValidRole(r)) {
                    return false;
                }
            }
        }
        return true;
    }
    ;
    isInRole(roleName) {
        return async (req, res, next) => {
            if (!req.user) {
                responce(res).forbidden('require authentication');
                return;
            }
            if (req.user.roles) {
                for (let r of req.user.roles) {
                    if (r.name === roleName) {
                        next();
                        return;
                    }
                }
            }
            responce(res).forbidden(`Require ${roleName} Role!`);
            return;
        };
    }
    isJson(req, res, next) {
        const toJsonNext = (data) => {
            req.body = JSON.parse(data);
            next();
        };
        if (req.body && req.header('content-type') === 'application/json') {
            // toJsonNext(req.body);
            next();
        }
        else if (req.file && req.file.mimetype === 'application/json') {
            fs.readFile(req.file.path, 'utf8', (err, data) => {
                if (err) {
                    responce(res).error(err);
                }
                else {
                    toJsonNext(data);
                }
            });
        }
        else {
            responce(res).badRequest('content must be valid application/json');
        }
    }
}
export default new Middlewares();
