

import { DefaultController } from '../../controllers/index.js';
import express from 'express';
import { IDefaultRoutesConfig, IMethod} from "./interfaces.js";
import _ from "passport-local-mongoose";

declare global {
  interface Array<T> {
    removeDiplicates(): T[];
    isIndex(item: any): boolean
    isFound(item: any): boolean
    findItem(item: any): T
    findNamedItem(key: string, value: any): T
    deleteItemInArray(item: string): T[]
    deleteNamedItemInArray(key: string, value: any, arr: any[]): T[]
  }
}
if (!Array.prototype.removeDiplicates) {
  Array.prototype.removeDiplicates = function (): any[] { return [...new Set(this)] };
  Array.prototype.isIndex = function (item: any): boolean { return (this.indexOf(item) !== -1) };
  Array.prototype.isFound = function (item: any): boolean { return this.find((e) => e === item) !== undefined };
  Array.prototype.findItem = function (item: any): boolean { return this.find((e) => e === item) };
  Array.prototype.findNamedItem = function (key: string, value: any) { return this.find((item) => item[key] === value) };
  Array.prototype.deleteItemInArray = function (item: string): any[] {
    let index = this.findIndex((v: any) => v === item);
    if (index !== -1)
      this.splice(index, 1);

    return this;
  };
  Array.prototype.deleteNamedItemInArray = function (key: string, value: any): any[] {
    let index = this.findIndex((item: any) => item[key] === value);
    if (index !== -1)
      this.splice(index, 1);

    return this;
  }
}

//const mongooseErrorKeys = Object.keys(mongoose.Error);
//const mongoServerErrorKeys = Object.keys(MongoServerError);


export const responces = {

  success(res: express.Response, message: string = 'operation Successful!') { return res.json({ success: true, message }) },
  error(res: express.Response, error: any, status: number = 400) {
    console.error(error.stack, status);
    return res.status(status).json({ success: false, error: error?.message ?? 'error operation faild!' });
  },

  notFound(res: express.Response) { return res.status(404).json({ success: false, error: "NotFound" }) },
  badRequest(res: express.Response) { return res.status(400).json({ success: false, error: "BadRequest!" }) },
  unAuthorized(res: express.Response) { return res.status(401).json({ success: false, error: "unAuthorized!" }) },
  forbidden(res: express.Response) { return res.status(403).json({ success: false, error: "forbidden!" }) },
  data(res: express.Response, data: any, total?: number) { return res.json({ success: true, data, total }) },
  json(res: express.Response, obj: {}) { return res.json(obj) },
  ok(res: express.Response) { return res.status(200) }
}
const  mongooseItems = ['type', 'unique','select', 'tagName', 'lowercase', 'uppercase', 'ref', 'autopopulate'];
export const mongooseMethods = ["deleteMany", "deleteOne", "find", "findById", "findByIdAndDelete", "findByIdAndRemove", "findByIdAndUpdate", "findOne", "findOneAndDelete", "findOneAndReplace", "findOneAndUpdate", "replaceOne", "updateMany,updateOne"];
export const defaultActions = ["list", "get", "create", "update", "delete", "search", "count"];
export const configrationActions = [ "matadata","viewdata","routedata","routes","viewsdata", "routesdata","addRoute", "removeRoute","disableRoutes","enableRoutes"];
export const appActions = [...defaultActions,...configrationActions] ;
export type IAppActions = "list"| "get"|"create"| "update" |"delete"| "search"|"count"|"matadata"|"viewdata"|"routedata"|"routes"|"viewsdata"|"routesdata"|"addRoute"| "removeRoute"|"disableRoutes"|"enableRoutes";
export const appMethods: IMethod[] = ["get","post","put","delete","options"];

export function isValidAction(action: string) { return defaultActions.isFound(action); }

export const sortArray = (itemsArray: any[], propKey: string) => {
  let sorted = itemsArray.sort((item1, item2) => (item1[propKey] > item2[propKey]) ? 1 : (item1[propKey] < item2[propKey]) ? -1 : 0);
  return sorted;
}

export const Roles = ["user", "admin", "application"];
export const isValidRole = (role: string) => (role && Roles.isFound(role));

export function removeItemsFromObject(target: any, keys: string[]) {

  for (let key of keys) {
    if (target[key]) {
      delete target[key];
    }
  };
  return target;
}


export function assignIfNotUndefined(target: any, source: any) {
  for (let [key, value] of Object.entries(source)) {
    if (value) {
      target[key] ??= (Array.isArray(value) ? value.removeDiplicates() : value);
    }
  }
}


// db object
//export const dbStore: IModelDb[] = [];

// routesStore
//export const routeStore: IDefaultRoutesConfig[] = [];

export const appData: Map<string, IDefaultRoutesConfig> = new Map();

export function extendedInstance<A extends DefaultController>(arg: any[], c: new (...args: any[]) => A): A {
  return new c(...arg);
}


export async function createInstance<T>(constructor: new (...args: any[]) => T, ...args: any[]): Promise<T> {
  return Promise.resolve(new constructor(...args));
}

export async function activator(type: any, ...arg: any[]) {
  // if(arg)
  return await Promise.resolve(new type(...arg));
  // usage:
  // const classcc = activator(ClassA);
  //const classee = activator(ClassA, ['']);
}


interface KeyValueObject {
  [key: string]: string | number | boolean | object;
}

const example: KeyValueObject = {
  name: 'Alice',
  age: 30,
  salary: 50000
};
// Generics provide a way to define the types of keys and values dynamically:
export function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

/*
  async geFormtMetaData() {
    let items: IPropertyInfo[] = [];

    this.route.controller.db.schema.eachPath((path, schematype) => {
      if ('_id createdAt updatedAt __v'.indexOf(path) === -1) {
        let { instance, options } = schematype;

        let atts = this.config.schemaObj[path];
        envs.logLine(path) 
        console.log(`instance ${instance} --- pathType : ${this.route.controller.db.schema.pathType(path)} ---  options:\n`,options) 
         if(path)
          return;
        // if (atts && typeof atts === 'object' && Object.getPrototypeOf(atts) === Object.prototype)

        let tagName = atts["tagName"] ?? instance;

        let attributes = removeItemsFromObject({ ...atts },mongooseItems);
        let item: any = { name: path, schemaType: instance, tagName, attributes };

        if ("ObjectId Array Object".indexOf(instance) !== -1) {
          let ref = atts["ref"];
          //console.log('object or ObjectId or arry : === >\n', ref);

          if (ref && typeof ref === 'string' && appData.has(ref)) {
            let obj = appData.get(ref)?.controller.config;
            if (obj?.queryKey)
              item['displayName'] = obj?.queryKey;
          }

          item.tagName = 'select';
        }
        else if (["text", "email", "telphone", "radio", "checkbox", "date", "img"].isFound(tagName)) {
          item.tagName = 'input';
          item.attributes['type'] = tagName;

        } else if (instance === "String") {
          let maxLength = atts['minLength'];
          if (maxLength && maxLength > 100) {
            item.tagName = 'textarea';
          } else {
            item.tagName = 'input';
            item.attributes['type'] = 'text';
          }
        } else if ("Boolean Date".indexOf(instance) !==-1) {
          item.tagName = 'input';
          item.attributes['type'] = instance === "Date" ? "date" : "checkbox";
        } else {
          console.log(`unexpected value for the path -> ${path} - instance of: ----> ${instance} \n`)
        }

        items.push(item as IPropertyInfo);
      }
    });
    
    return items
  }
*/