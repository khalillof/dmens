import { Svc, responce } from '../../common/index.js';
import { uploadSchema } from '../../routes/index.js';
import fs from 'fs';
import { authenticateJwt as authenticate } from '../../services/index.js';
async function getUserFromReq(req) {
    return req.body && req.body.email ? await Svc.db.get('account').findOne({ email: req.body.email }) : null;
}
function checkLoginUserFields(req, res, next) {
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
        }
        else {
            responce(res).badRequest('Missing required body fields');
        }
    }
    else {
        responce(res).badRequest('Missing required body fields');
    }
}
async function validateSameEmailDoesntExist(req, res, next) {
    await getUserFromReq(req) ? responce(res).badRequest('User email already exists') : next();
}
function validateCurrentUserOwnParamId(req, res, next) {
    let user = req.user;
    user && String(user._id) === String(req.params['id']) ? next() : responce(res).unAuthorized();
}
function validateBodyEmailBelongToCurrentUser(req, res, next) {
    (req.user && req.body.email === req.user.email) ? next() : responce(res).unAuthorized();
}
function validateHasQueryEmailBelongToCurrentUser(req, res, next) {
    (req.user && req.query.email === req.user.email) ? next() : responce(res).forbidden('not authorized, require valid email');
}
async function userExist(req, res, next) {
    await getUserFromReq(req) ? next() : responce(res).forbidden('User does not exist : ' + req.body.email);
}
function isAuthenticated(req, res, next) {
    req.user ? next() : responce(res).unAuthorized();
}
function isInRole(roleName) {
    return async (req, res, next) => {
        if (!req.user) {
            responce(res).forbidden('require authentication');
            return;
        }
        else if (req.user.roles) {
            for (let r of req.user.roles) {
                if (r.name === roleName) {
                    next();
                    return;
                }
            }
        }
        else {
            responce(res).forbidden(`Require ${roleName} Role!`);
            return;
        }
    };
}
const isAdmin = async (req, res, next) => isInRole('admin')(req, res, next);
function isJson(req, res, next) {
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
//}
//export default new Middlewares();
const Middlewares = { authenticate, getUserFromReq, checkLoginUserFields, validateSameEmailDoesntExist,
    validateCurrentUserOwnParamId, validateBodyEmailBelongToCurrentUser, validateHasQueryEmailBelongToCurrentUser,
    userExist, uploadSchema, isAuthenticated, isAdmin, isInRole, isJson };
export default Middlewares;
