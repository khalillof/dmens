"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendController = exports.createInstance = exports.getProperty = exports.getCont =  exports.extendedInstance = exports.routeStore  = exports.dbStore = exports.returnJson = exports.activator = void 0;

function returnJson(obj, status, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(obj);
}
exports.returnJson = returnJson;


function extendedInstance(arg, c) {
    return new c(...arg);
}
exports.extendedInstance = extendedInstance;


// db object
exports.dbStore = {};

function getDb(url) {

    for (let d in exports.dbStore) {
        if (d !== '/' && url.match(d.toLowerCase())) {
            return exports.dbStore[d];
        }
    }
    throw new Error('service not found for arg :' + url);
}
exports.getDb = getDb;

// routesStore
exports.routeStore = {};

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

async function activator(type, ...arg) {
    // if(arg)
  return await Promise.resolve(new type(...arg));
  // usage:
  //const classcc = activator(ClassA);
 //const classee = activator(ClassA, ['']);
}
exports.activator = activator
