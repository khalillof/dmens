import express from 'express'
import { Model, Schema } from 'mongoose';
/*
export interface ISvc {

  db: Model<any, any>;

  //create: (resource: any) => Promise<any>,
  create<Tentity>(resource: Tentity): Promise<Tentity>;
  putById: (resourceId: any) => Promise<string>;
  getById: (resourceId: any) => Promise<any>;
  deleteById: (resourceId: any) => Promise<string>;
  patchById: (resourceId: any) => Promise<string>;
  Tolist<Tentity>(limit: number, page: number): Promise<Tentity[]>;
}*/
export interface JsonSchema {
  name: string;
  loadref: boolean;
  schema: Schema
};
export interface IJsonModel {

  readonly name: string;
  readonly schema?: Schema;
  readonly model?: Model<any>;
  readonly populateNames: Array<string>;
  readonly loadref: boolean;
  readonly hasPopulate: boolean;

  log(...data: any[]): void;

  // private loadPopulates(_schema?:any):void;

  //private  factory(stringObj:string):any;
  // private  getOnePopulated(arg:any, method?:string):Promise<any>;

  // private getListPopulated(limit?:number, page?:number, query?:{}):Promise<[any]>
  // search item in object and map to mongoose schema
  // private deepSearch(obj:any, indx:number, arr:Array<any>):any;

  //createInstance(jsonModel?:any, callback?:any):Promise<IJsonModel>;
  Tolist(limit?: number, page?: number, query?: {}): Promise<[any]>;
  findById(id: string): Promise<any>;
  findOne(query: {}): Promise<any>;
  create(obj: object): Promise<any>;
  putById(id: string, objFields: object): Promise<any>;

  deleteById(id: string): Promise<any>;
  deleteByQuery(query: {}): Promise<any>;
  patchById(id: string, objFields: object): Promise<any>;
}

export interface IConstructor<T> {
  new(...args: any[]): T;
}
export interface Iresponces {
  errObjInfo: (err: any, obj: any, info: any) => void;
  success: (msg?: string) => void;
  fail:(msg?:string)=> void;
  errStatus: (status: number, msg: string) => void;
  notAuthorized: (msg?: string) => void;
  error: (err: any) => void;
  item: (item: {}, message?: string) => void;
  items: (items: {}, message?: string) => void;
  errCb: (err: any, cb: Function) => void;
  errSuccess: (err: any) => void;
  callback: (cb: Function, obj?: any) => void;
  json: (obj: object) => void;
};
// function with parmeters interface 
export interface Iresponce {
  (res: express.Response, cb?: Function): Iresponces;
}
export interface Ilogger {
  log: (msg: string) => void;
  err: (err: any) => void;
  resErrMsg: (res: express.Response, ErorMsg?: string) => void;
  resErr: (res: express.Response, err: any) => void;
};

export interface IController {

  db: IJsonModel;
  responce: Iresponce;
  log: Ilogger;
  list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  findById(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  findOne(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  patch(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  put(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  remove(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  tryCatchActions(actionNam: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;

};


export interface IDefaultRoutesConfig {
  app: express.Router;
  routeName: string;
  routeParam: string;
  controller?: IController;
  corsWithOption: any;
  mware?: IMiddlewares;
  authenticate: Iauthenticate;
  //actions:Function;
  buildMdWares(middlewares?: Array<Function>, useMWare?: boolean): any[];
  // custom routes
  getList(middlewares?: any, useMWare?: boolean): express.Application;
  getId(middlewares?: any, useMWare?: boolean): express.Application;
  post(middlewares?: any, useMWare?: boolean): express.Application;
  put(middlewares?: any, useMWare?: boolean): express.Application;
  delete(middlewares?: any, useMWare?: boolean): express.Application;
  param(): void;
  defaultRoutes(): void;
  actions(actionName: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
}

export interface IMiddlewares {


  getUserFromReq(req: express.Request): Promise<any>;
  validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction): void;

  validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction): void;

  validateSameEmailBelongToSameUser(req: express.Request, res: express.Response, next: express.NextFunction): void;

  // Here we need to use an arrow function to bind `this` correctly
  validatePatchEmail(req: express.Request, res: express.Response, next: express.NextFunction): void;

  userExist(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

  isAuthenticated(req: any, res: express.Response, next: express.NextFunction): void;
  // roles
  isRolesExist(roles: [string]): boolean;


  isInRole(roleName: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
}
export interface Iauthenticate {
  (type: any, opts?: any): (req: any, res: any, next: any) => Promise<any>
}