"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activator = exports.createInstance = exports.extendedInstance = exports.routeStore = exports.dbStore = exports.isValidRole = exports.Roles = exports.sortArray = exports.responce = exports.logger = exports.errStore = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const assertionError_js_1 = require("../lib/assertionError.js");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
exports.errStore = [mongoose_1.default.Error.ValidatorError, mongoose_1.default.Error.ValidationError, mongoose_1.default.Error.CastError, assertionError_js_1.AssertionError, mongodb_1.MongoServerError, jsonwebtoken_1.default.TokenExpiredError];
exports.logger = {
    log: console.log,
    err: (err) => console.error(err.stack),
    resErrMsg: (res, ErorMsg) => res.status(400).json({ success: false, error: ErorMsg || 'operation faild!' }),
    resErr: function (res, err) {
        if (err) {
            let errInstance = exports.errStore.filter((errObj) => {
                if (err instanceof errObj) {
                    return errObj;
                }
            })[0];
            //console.log(instance.length)
            let msg = errInstance ? err.message : 'operation faild! server error';
            this.err(err);
            this.resErrMsg(res, msg);
        }
    }
};
const responce = (res, cb) => {
    let successMsg = 'operation Successful!';
    let errMsg = 'error operation faild!';
    const self = {
        errObjInfo: (error, obj, info) => {
            if (obj) {
                cb ? self.callback(cb) : self.success();
                return;
            }
            self.fail(error ? error.message : info.message);
            exports.logger.err(error ?? info);
            return;
        },
        success: (msg) => res.json({ success: true, message: msg ?? successMsg }),
        fail: (error) => res.json({ success: false, error: (error ?? errMsg) }),
        errStatus: (status, error) => res.status(status).json({ success: false, error }),
        notFound: (msg) => self.errStatus(404, msg ?? 'NotFound!'),
        badRequest: (msg) => self.errStatus(400, msg ?? 'bad Request!'),
        unAuthorized: (msg) => self.errStatus(401, msg ?? 'unAuthorized!'),
        forbidden: (msg) => self.errStatus(403, msg ?? 'forbidden!'),
        error: (error) => exports.logger.resErr(res, error),
        data: (data, message, total) => res.json({ success: true, message, data, total }),
        errCb: (error, cb) => error ? self.error(error) : self.callback(cb),
        errSuccess: (error) => error ? self.error(error) : self.success(),
        callback: (cb, obj) => cb && typeof cb === 'function' ? cb(obj) : false,
        json: (obj) => res.json(obj),
        ok: () => res.status(200)
    };
    return self;
};
exports.responce = responce;
const sortArray = (itemsArray, propKey) => {
    let sorted = itemsArray.sort((item1, item2) => (item1[propKey] > item2[propKey]) ? 1 : (item1[propKey] < item2[propKey]) ? -1 : 0);
    return sorted;
};
exports.sortArray = sortArray;
exports.Roles = ["user", "admin", "application"];
const isValidRole = (role) => (role && exports.Roles.indexOf(role) !== -1);
exports.isValidRole = isValidRole;
// db object
exports.dbStore = [];
// routesStore
exports.routeStore = [];
function extendedInstance(arg, c) {
    return new c(...arg);
}
exports.extendedInstance = extendedInstance;
async function createInstance(constructor, ...args) {
    return Promise.resolve(new constructor(...args));
}
exports.createInstance = createInstance;
async function activator(type, ...arg) {
    // if(arg)
    return await Promise.resolve(new type(...arg));
    // usage:
    // const classcc = activator(ClassA);
    //const classee = activator(ClassA, ['']);
}
exports.activator = activator;
