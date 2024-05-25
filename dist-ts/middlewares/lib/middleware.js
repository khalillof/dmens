"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_js_1 = require("../../common/index.js");
const index_js_2 = require("../../services/index.js");
const index_js_3 = require("../../routes/index.js");
const fs_1 = tslib_1.__importDefault(require("fs"));
const index_js_4 = require("../../services/index.js");
async function getUserFromReq(req) {
    return req.body && req.body.email ? await index_js_2.Store.db.get('account').findOne({ email: req.body.email }) : null;
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
            (0, index_js_1.responce)(res).badRequest('Missing required body fields');
        }
    }
    else {
        (0, index_js_1.responce)(res).badRequest('Missing required body fields');
    }
}
async function validateSameEmailDoesntExist(req, res, next) {
    await getUserFromReq(req) ? (0, index_js_1.responce)(res).badRequest('User email already exists') : next();
}
function validateCurrentUserOwnParamId(req, res, next) {
    let user = req.user;
    user && String(user._id) === String(req.params['id']) ? next() : (0, index_js_1.responce)(res).unAuthorized();
}
function validateBodyEmailBelongToCurrentUser(req, res, next) {
    (req.user && req.body.email === req.user.email) ? next() : (0, index_js_1.responce)(res).unAuthorized();
}
function validateHasQueryEmailBelongToCurrentUser(req, res, next) {
    (req.user && req.query.email === req.user.email) ? next() : (0, index_js_1.responce)(res).forbidden('not authorized, require valid email');
}
async function userExist(req, res, next) {
    await getUserFromReq(req) ? next() : (0, index_js_1.responce)(res).forbidden('User does not exist : ' + req.body.email);
}
function isAuthenticated(req, res, next) {
    req.user ? next() : (0, index_js_1.responce)(res).unAuthorized();
}
function isInRole(roleName) {
    return async (req, res, next) => {
        if (!req.user) {
            (0, index_js_1.responce)(res).forbidden('require authentication');
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
            (0, index_js_1.responce)(res).forbidden(`Require ${roleName} Role!`);
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
        fs_1.default.readFile(req.file.path, 'utf8', (err, data) => {
            if (err) {
                (0, index_js_1.responce)(res).error(err);
            }
            else {
                toJsonNext(data);
            }
        });
    }
    else {
        (0, index_js_1.responce)(res).badRequest('content must be valid application/json');
    }
}
//}
//export default new Middlewares();
const Middlewares = { uploadSchema: index_js_3.uploadSchema, authenticate: index_js_4.authenticateJwt, getUserFromReq, checkLoginUserFields, validateSameEmailDoesntExist,
    validateCurrentUserOwnParamId, validateBodyEmailBelongToCurrentUser, validateHasQueryEmailBelongToCurrentUser,
    userExist, isAuthenticated, isAdmin, isInRole, isJson };
exports.default = Middlewares;
