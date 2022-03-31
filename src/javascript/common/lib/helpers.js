"use strict";
const { ValidationError, ValidatorError} = require("mongoose").Error;
const {MongoServerError} = require("mongodb");
const {AssertionError} = require('../lib/assertionError')
const { JsonWebTokenError} = require('jsonwebtoken');
const pluralize = require('pluralize');
//var aaa = require('express')
exports.errStore = [ValidatorError, ValidationError,AssertionError,MongoServerError,JsonWebTokenError];

exports.logger = {
    log:console.log,
    err:(err)=> console.error(err.stack),
    resErrMsg:(res, ErorMsg)=> res.json({ success: false, error:ErorMsg ? ErorMsg: 'operation faild!' }),
    resErr:function(res,err){
        if (err) {
           let errInstance= exports.errStore.filter((errObj)=> {
               if(err instanceof errObj){ 
                   return errObj
               }
            })[0];
            //console.log(instance.length)
           let msg = errInstance ? err.message : 'operation faild! server error'
            this.err(err); 
            this.resErrMsg(res,msg)
          }
    }
}
exports.responce =(res, cb)=>{
    let successMsg='operation Successful!';
    let  errMsg='error operation faild!';

    let self= { 
        errObjInfo:(err, obj, info)=>{
            if (obj) {
              cb ? self.callback(cb) : self.success();
              return;
            }
            self.success(false, err ? err.message : info.message);
            logger.err(err ?? info)
            return;
          },
          success:(msg)=>res.json({success:true,message:msg ?? successMsg}),
           fail:(msg)=> res.json({success:false,error:msg ?? errMsg}),
          errStatus:(status,msg)=> res.status(status).json({success:false,error:msg}),
          notAuthorized: (msg)=> self.errStatus(403,msg ?? 'not authorized'),
          error:(err)=> logger.resErr(res, err),
          item:(item, message)=> res.json({ success: true, message: message ?? successMsg, item: item }),
          items:(items, message)=> res.json({ success: true, message: message ?? successMsg, items: items }),
          errCb:(err, cb)=> err ? self.error(err) : self.callback(cb),
          errSuccess:(err)=> err ? self.error(err) : self.success(),
          callback:(cb, obj) => cb && typeof cb === 'function' ? cb(obj) : false,
          json:(obj) => res.json(obj)
    }

    return self;
  };

exports.Roles =["user", "admin", "application"];
exports.isValidRole =(role)=> role ?  exports.Roles.indexOf(role) !== -1 : false;

exports.printRoutesToString = (app)=>{ 
    let result = app._router.stack
      .filter((r) => r.route)
      .map((r) => Object.keys(r.route.methods)[0].toUpperCase().padEnd(7) + r.route.path)
      .join("\n");

      console.log('================= All Routes avaliable ================ \n'+ result)
      return;
  }

exports.printRoutesToJson = (app)=>{
    let result = app._router.stack
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

exports.pluralizeRoute =(routeName)=> { 
    routeName = routeName.toLowerCase();
    if (routeName.indexOf('/') == -1){
       return ('/'+ pluralize(routeName));
    }else{
        return routeName;
    } 
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

exports.getCont = function(routename){
    for (let d in exports.routeStore) {
        if (d !== '/' && routename.match(d) || d === '/' && routename === d) {
            // console.log('from getcon : '+url +' - '+d)
            return exports.routeStore[d].controller;
        }
    }
    return null;
    //throw new Error('controller not found for the url :' + routename);
}

exports.getProperty = (obj, key)=> {
    return obj[key];
}

exports.extendedInstance = (c, arg)=> {
    return new c(...arg);
}

exports.createInstance = (type, ...args)=> {
    return new type(...args);
}
exports.createInstance = async (type, ...args)=> {
    return await Promise.resolve(new type(...args));
}

