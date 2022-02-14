"use strict";

const pluralize = require('pluralize');
const router = require('express').Router();

exports.appRouter = router;
  
exports.printRoutesToString = ()=>{
    let result = exports.appRouter.stack
      .filter((r) => r.route)
      .map((r) => Object.keys(r.route.methods)[0].toUpperCase().padEnd(7) + r.route.path)
      .join("\n");
      
      console.log('================= All Routes avaliable ================ \n'+ result)
  }
exports.printRoutesToJson = ()=>{
    let result = exports.appRouter.stack
        .filter((r) => r.route)
        .map((r) => {
        return {
            method: Object.keys(r.route.methods)[0].toUpperCase(),
            path: r.route.path
        };
    });
    console.log('================= All Routes avaliable ================ \n'+ JSON.stringify(result, null, 2))
    //console.log(JSON.stringify(result, null, 2));
  }

exports.returnJson = (obj, status, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(obj);
}


exports.pluralizeRoute =(routeName)=> { 
    routeName = routeName.toLowerCase();
    if (routeName.indexOf('/') == -1){
       return ('/'+ pluralize(routeName));
    }else{
        return routeName;
    } 
}

exports.extendedInstance = (c, arg)=> {
    return new c(...arg);
}

// db object
exports.dbStore = {};

exports.getDb =(url) =>{

    for (let d in exports.dbStore) {
        if (url !== '/' && url.match(d.toLowerCase())) {
            return exports.dbStore[d];
        }
    }
    throw new Error('service not found for arg :' + url);
}

// routesStore
exports.routeStore = {};

exports.getCont = (url)=> {
    for (let d in exports.routeStore) {
        if (d !== '/' && url.match(d) || d === '/' && url === d) {
            // console.log('from getcon : '+url +' - '+d)
            return exports.routeStore[d].controller;
        }
    }
    throw new Error('controller not found for the url :' + url);
}

exports.getProperty = (obj, key)=> {
    return obj[key];
}

exports.createInstance = (type, ...args)=> {
    return new type(...args);
}
exports.createInstance = async (type, ...args)=> {
    return await Promise.resolve(new type(...args));
}

