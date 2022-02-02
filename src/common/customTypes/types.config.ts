import mongoose, {Model, Schema} from 'mongoose';
import {ISvc} from '../../services/ISvc.services'
import {IController} from '../../controllers/Icontroller.controller'
import {DefaultRoutesConfig} from '../../routes/default.routes.config'
import {DefaultController} from '../../controllers/default.controller'

export function returnJson (obj : any,status:number, res: any){
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json(obj)
  };
export interface JsonSchema  {name:string,schema?:Schema |any};
export interface IConstructor<T> {
  new (...args: any[]): T;
}
// types
export type Dic<Type>  = { [key: string] : Type};
export type routData = {routeName :string, controller :any,Service:any};

// db object
export const dbStore : Dic<Model<any,any> | any> = {};
// model object
export const SvcStore : Dic<ISvc> = {};
export var modelStore : Dic<Schema> = {};
// routesDb
export const routeStore : Dic<DefaultRoutesConfig> = {};

export function extendedInstance<A extends DefaultController>(arg:any[], c: new(...args: any[])=> A): A {   
  return new c(...arg);
}

export function  getSvc(url:string):ISvc{
     for(let d in SvcStore){
      if(d !== '/' && url.match(d.toLowerCase())){
      return SvcStore[d];
    }
  }
  throw new Error('service not found for arg :'+ name);
}  

export function  getCont(url:string):IController{
    for(let d in routeStore){     
      if(d !== '/' && url.match(d) || d === '/' && url === d){
     // console.log('from getcon : '+url +' - '+d)
      return routeStore[d].controller;
    }
  }  
  throw new Error('controller not found for the url :'+ url);
}

export function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key];
}

export function createInstance<T>(constructor: new(...args: any[])=> T, ...args: any[]): T  {
    return new constructor(...args);
  }

export function extendController<T extends IController>(type: IConstructor<T>, ...arg:any[]): T {
     return new type(...arg);
 }
////////////////////////////////

// Generic Model Parameter
export interface IGenericModel<T> extends IConstructor<T> {
  tableName: string;
  displayProp: string;
}

//(data model is the class name of your model)
type  modelType = <T>({}) => T;
type modelTypee<T> = {arg:any[] ,new(...args: any[]):T}
