import mongoose from "mongoose";
import { MongoServerError } from "mongodb";
import { AssertionError } from '../lib/assertionError.js';
import jwt from 'jsonwebtoken';
export const errStore = [mongoose.Error.ValidatorError, mongoose.Error.ValidationError, mongoose.Error.CastError, AssertionError, MongoServerError, jwt.TokenExpiredError];
export const logger = {
    log: console.log,
    err: (err) => console.error(err.stack),
    resErrMsg: (res, ErorMsg) => res.status(400).json({ success: false, error: ErorMsg || 'operation faild!' }),
    resErr: function (res, err) {
        if (err) {
            let errInstance = errStore.filter((errObj) => {
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
export const responce = (res, cb) => {
    let successMsg = 'operation Successful!';
    let errMsg = 'error operation faild!';
    const self = {
        errObjInfo: (error, obj, info) => {
            if (obj) {
                cb ? self.callback(cb) : self.success();
                return;
            }
            self.fail(error ? error.message : info.message);
            logger.err(error ?? info);
            return;
        },
        success: (msg) => res.json({ success: true, message: msg ?? successMsg }),
        fail: (error) => res.json({ success: false, error: (error ?? errMsg) }),
        errStatus: (status, error) => res.status(status).json({ success: false, error }),
        notFound: (msg) => self.errStatus(404, msg ?? 'NotFound!'),
        badRequest: (msg) => self.errStatus(400, msg ?? 'bad Request!'),
        unAuthorized: (msg) => self.errStatus(401, msg ?? 'unAuthorized!'),
        forbidden: (msg) => self.errStatus(403, msg ?? 'forbidden!'),
        error: (error) => logger.resErr(res, error),
        data: (data, message, total) => res.json({ success: true, message, data, total }),
        errCb: (error, cb) => error ? self.error(error) : self.callback(cb),
        errSuccess: (error) => error ? self.error(error) : self.success(),
        callback: (cb, obj) => cb && typeof cb === 'function' ? cb(obj) : false,
        json: (obj) => res.json(obj),
        ok: () => res.status(200)
    };
    return self;
};
export const sortArray = (itemsArray, propKey) => {
    let sorted = itemsArray.sort((item1, item2) => (item1[propKey] > item2[propKey]) ? 1 : (item1[propKey] < item2[propKey]) ? -1 : 0);
    return sorted;
};
export const Roles = ["user", "admin", "application"];
export const isValidRole = (role) => (role && Roles.indexOf(role) !== -1);
// db object
export const dbStore = [];
// routesStore
export const routeStore = [];
export function extendedInstance(arg, c) {
    return new c(...arg);
}
export async function createInstance(constructor, ...args) {
    return Promise.resolve(new constructor(...args));
}
export async function activator(type, ...arg) {
    // if(arg)
    return await Promise.resolve(new type(...arg));
    // usage:
    // const classcc = activator(ClassA);
    //const classee = activator(ClassA, ['']);
}
