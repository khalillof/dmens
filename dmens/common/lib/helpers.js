import mongoose from "mongoose";
import { MongoServerError } from "mongodb";
import { AssertionError } from '../lib/assertionError.js';
import jwt from 'jsonwebtoken';
import pluralize from './pluralize.js';
export const errStore = [mongoose.Error.ValidatorError, mongoose.Error.ValidationError, AssertionError, MongoServerError, jwt.TokenExpiredError];
export const logger = {
    log: console.log,
    err: (err) => console.error(err.stack),
    resErrMsg: (res, ErorMsg) => res.status(400).json({ success: false, message: ErorMsg ? ErorMsg : 'operation faild!' }),
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
    let self = {
        errObjInfo: (err, obj, info) => {
            if (obj) {
                cb ? self.callback(cb) : self.success();
                return;
            }
            self.fail(err ? err.message : info.message);
            logger.err(err ?? info);
            return;
        },
        success: (msg) => res.json({ success: true, message: msg ?? successMsg }),
        fail: (msg) => res.json({ success: false, message: msg ?? errMsg }),
        errStatus: (status, msg) => res.status(status).json({ success: false, message: msg }),
        badRequest: (msg) => self.errStatus(400, msg ?? 'bad Request!'),
        unAuthorized: (msg) => self.errStatus(401, msg ?? 'unAuthorized!'),
        forbidden: (msg) => self.errStatus(403, msg ?? 'forbidden!'),
        error: (err) => logger.resErr(res, err),
        data: (data, message, total) => res.json({ success: true, message: message ?? successMsg, data, total }),
        errCb: (err, cb) => err ? self.error(err) : self.callback(cb),
        errSuccess: (err) => err ? self.error(err) : self.success(),
        callback: (cb, obj) => cb && typeof cb === 'function' ? cb(obj) : false,
        json: (obj) => res.json(obj)
    };
    return self;
};
export const Roles = ["user", "admin", "application"];
export const isValidRole = (role) => role ? Roles.indexOf(role) !== -1 : false;
export function printRoutesToString(app) {
    let result = app._router.stack
        .filter((r) => r.route)
        .map((r) => Object.keys(r.route.methods)[0].toUpperCase().padEnd(7) + r.route.path)
        .join("\n");
    console.log('================= All Routes avaliable ================ \n' + result);
}
export function printRoutesToJson(app) {
    let result = app._router.stack
        .filter((r) => r.route)
        .map((r) => {
        return {
            method: Object.keys(r.route.methods)[0].toUpperCase(),
            path: r.route.path
        };
    });
    console.log('================= All Routes avaliable ================ \n' + JSON.stringify(result, null, 2));
    //console.log(JSON.stringify(result, null, 2));
}
export function pluralizeRoute(routeName) {
    routeName = routeName.toLowerCase();
    if (routeName.indexOf('/') == -1) {
        return ('/' + pluralize(routeName));
    }
    else {
        return routeName;
    }
}
// db object
export const dbStore = {};
export function getDb(url) {
    for (let d in dbStore) {
        if (url !== '/' && url.match(d.toLowerCase())) {
            return dbStore[d];
        }
    }
    throw new Error('service not found for arg :' + url);
    ;
    //throw 
}
// routesStore
export const routeStore = {};
export function getCont(url) {
    for (let d in routeStore) {
        if (d !== '/' && url.match(d) || d === '/' && url === d) {
            // console.log('from getcon : '+url +' - '+d)
            return routeStore[d].controller;
        }
    }
    return null;
    //throw new Error('controller not found for the url :'+ url);
}
export function extendedInstance(arg, c) {
    return new c(...arg);
}
export function getProperty(obj, key) {
    return obj[key];
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
