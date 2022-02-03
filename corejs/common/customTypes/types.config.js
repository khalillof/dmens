"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendController = exports.createInstance = exports.getProperty = exports.getCont = exports.getSvc = exports.extendedInstance = exports.routeStore = exports.modelStore = exports.SvcStore = exports.dbStore = exports.returnJson = void 0;

function returnJson(obj, status, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(obj);
}
exports.returnJson = returnJson;
;
;
// db object
exports.dbStore = {};
// model object
exports.SvcStore = {};
exports.modelStore = {};
// routesDb
exports.routeStore = {};
function extendedInstance(arg, c) {
    return new c(...arg);
}
exports.extendedInstance = extendedInstance;
function getSvc(url) {

    for (let d in exports.SvcStore) {
        if (d !== '/' && url.match(d.toLowerCase())) {
            return exports.SvcStore[d];
        }
    }
    throw new Error('service not found for arg :' + url);
}
exports.getSvc = getSvc;
function getCont(url) {
    for (let d in exports.routeStore) {
        if (d !== '/' && url.match(d) || d === '/' && url === d) {
            // console.log('from getcon : '+url +' - '+d)
            return exports.routeStore[d].controller;
        }
    }
    throw new Error('controller not found for the url :' + url);
}
exports.getCont = getCont;
function getProperty(obj, key) {
    return obj[key];
}
exports.getProperty = getProperty;
function createInstance(constructor, ...args) {
    return new constructor(...args);
}
exports.createInstance = createInstance;
function extendController(type, ...arg) {
    return new type(...arg);
}
exports.extendController = extendController;
