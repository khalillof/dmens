
import { Error} from "mongoose";
import {MongoServerError} from "mongodb";
import {AssertionError} from '../lib/assertionError';
import { JsonWebTokenError} from 'jsonwebtoken';
import {IController,IJsonModel} from '../../interfaces'
import {DefaultController} from '../../controllers'
import {DefaultRoutesConfig} from '../../routes'
import express from 'express'

const pluralize = require('pluralize');

export const errStore = [Error.ValidatorError, Error.ValidationError,AssertionError,MongoServerError,JsonWebTokenError];

export const logger = {
    log:console.log,
    err:(err:any)=> console.error(err.stack),
    resErrMsg:(res:express.Response, ErorMsg?:string)=> res.json({ success: false, error:ErorMsg ? ErorMsg: 'operation faild!' }),
    resErr:function(res:express.Response,err:any){
        if (err) {
           let errInstance= errStore.filter((errObj:any)=> {
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
export const responce =(res:express.Response, cb?:Function)=>{
    let successMsg='operation Successful!';
    let  errMsg='error operation faild!';

    let self= { 
      errObjInfo:(err:any, obj:any, info:any)=>{
        if (obj) {
          cb ? self.callback(cb) : self.success();
          return;
        }
        self.success(false, err ? err.message : info.message);
        logger.err(err ?? info)
        return;
      },
      success:(success=true,msg?:string)=>{
        let message,error;
        success ===  true ? message = msg ?? successMsg : error = msg ?? errMsg
       res.json({success,message,error});
      },
      errStatus:(status:number,msg:string)=> {return res.status(status).json({success:false,error:msg})},
      error:(err:any)=> logger.resErr(res, err),
      item:(item:{}, message?:string)=>{res.json({ success: true, message: message ?? successMsg, item: item })},
      items:(items:{}, message?:string)=>{res.json({ success: true, message: message ?? successMsg, items: items })},
      errCb:(err:any, cb:Function)=>{ err ? self.error(err) : self.callback(cb)},
      errSuccess:(err:any)=>{err ? self.error(err) : self.success()},
      callback:(cb:Function, obj?:any) => cb && typeof cb === 'function' ? cb(obj) : false,
      json:(obj:{}) => res.json(obj)
    }

    return self;
  };

export const Roles =["user", "admin", "application"];
export const isValidRole =(role:string)=> role ?  Roles.indexOf(role) !== -1 : false;
  
export function printRoutesToString(app:express.Application){
    let result = app._router.stack
      .filter((r:any) => r.route)
      .map((r:any) => Object.keys(r.route.methods)[0].toUpperCase().padEnd(7) + r.route.path)
      .join("\n");
      
      console.log('================= All Routes avaliable ================ \n'+ result)
  }
export function printRoutesToJson(app:express.Application){
    let result =  app._router.stack
        .filter((r:any) => r.route)
        .map((r:any) => {
        return {
            method: Object.keys(r.route.methods)[0].toUpperCase(),
            path: r.route.path
        };
    });
    console.log('================= All Routes avaliable ================ \n'+ JSON.stringify(result, null, 2))
    //console.log(JSON.stringify(result, null, 2));
  }
  
export function pluralizeRoute(routeName:string){ 
  routeName = routeName.toLowerCase();
  if (routeName.indexOf('/') == -1){
     return ('/'+ pluralize(routeName));
  }else{
      return routeName;
  } 
}


// types
export type Dic<Type>  = { [key: string] : Type };

// db object
export const dbStore : Dic<IJsonModel>={};

export function  getDb(url:string):IJsonModel{
  for(let d in dbStore){
   if(url !== '/' && url.match(d.toLowerCase())){
   return dbStore[d];
 }
}
throw new Error('service not found for arg :'+ url);
}

// routesStore
export const routeStore : Dic<DefaultRoutesConfig> = {};

export function  getCont(url:string):IController | any{
    for(let d in routeStore){     
      if(d !== '/' && url.match(d) || d === '/' && url === d){
     // console.log('from getcon : '+url +' - '+d)
      return routeStore[d].controller;
    }
  } 
  return null; 
  //throw new Error('controller not found for the url :'+ url);
}

export function extendedInstance<A extends DefaultController>(arg:any[], c: new(...args: any[])=> A): A {   
  return new c(...arg);
}

export function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key];
}

export async function createInstance<T>(constructor: new(...args: any[])=> T, ...args: any[]):Promise<T>  {
    return Promise.resolve(new constructor(...args));
  }

export async function activator(type: any, ...arg:any[]){
  // if(arg)
   return await Promise.resolve(new type(...arg));
   // usage:
  // const classcc = activator(ClassA);
  //const classee = activator(ClassA, ['']);
}

