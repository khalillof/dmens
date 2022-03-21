import {Model, Schema} from 'mongoose';
import {ISvc} from '../../services'
import {IController, DefaultController} from '../../controllers'
import {DefaultRoutesConfig} from '../../routes'

const pluralize = require('pluralize');
import {Router} from 'express'


export const appRouter = Router();
  
export function printRoutesToString(){
    let result = exports.appRouter.stack
      .filter((r:any) => r.route)
      .map((r:any) => Object.keys(r.route.methods)[0].toUpperCase().padEnd(7) + r.route.path)
      .join("\n");
      
      console.log('================= All Routes avaliable ================ \n'+ result)
  }
export function printRoutesToJson(){
    let result = exports.appRouter.stack
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
export interface JsonSchema  {name:string,loadref:boolean,schema:Schema};

export interface IConstructor<T> {
  new (...args: any[]): T;
}
// types
export type Dic<Type>  = { [key: string] : Type};

// db object
export const dbStore : Dic<Model<any,any> | any> = {};

export function  getDb(url:string):ISvc{
  for(let d in dbStore){
   if(url !== '/' && url.match(d.toLowerCase())){
   return dbStore[d];
 }
}
throw new Error('service not found for arg :'+ name);
}

// routesStore
export const routeStore : Dic<DefaultRoutesConfig> = {};

export function  getCont(url:string):IController | null{
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

