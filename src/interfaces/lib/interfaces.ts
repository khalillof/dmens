import express from 'express'
import { Model, Schema } from 'mongoose';

export interface JsonSchema {
  name: string;
  populates?:Array<string>,
  useAuth?:Array<string>, 
  useAdmin?: Array<string>,
  schema: Schema
};
export interface IJsonModel {

  readonly name: string
  readonly schema?: Schema;
  readonly useAuth?:Array<string>
  readonly useAdmin?: Array<string>
  readonly model?: Model<any>;
  readonly populates?:Array<string>
  readonly hasPopulate: boolean
  checkAuth(method:string):Array<boolean>
  log(...data: any[]): void
  Tolist(limit: number, page: number, query: {}): Promise<[any]>;
  findById(id: string): Promise<any>
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
  badRequest: (msg?: string) => void;
  forbidden: (msg?: string) => void;
  unAuthorized: (msg?: string) => void;
  error: (err: any) => void;
  data: (item: {}, message?: string) => void;
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
  getOne(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  post(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  patch(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  put(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  tryCatchActions(actionNam: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;

};


export interface IDefaultRoutesConfig {
  app: express.Router;
  routeName: string;
  routeParam: string;
  controller?: IController;
  mware?: IMiddlewares;
  authenticate: Iauthenticate;
  //actions:Function;
  buildMdWares(middlewares?: Array<Function>, useAuth?: boolean, useAdmin?:boolean): any[];
  // custom routes
  buidRoute(routeName:string,method:string,actionName?:string | null,secondRoute?:string | null,middlewares?:Array<Function> |null):any
  
  options(routPath:string):void;
  param(): void;
  defaultRoutes(): void;
  actions(actionName: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
}

export interface IMiddlewares {


  getUserFromReq(req: express.Request): Promise<any>;
  validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction): void;

  validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction): void;

  validateCurrentUserOwnParamId(req: express.Request, res: express.Response, next: express.NextFunction): void;
  
  validateHasQueryEmailBelongToCurrentUser(req: any, res: express.Response, next: express.NextFunction):void;

  validateBodyEmailBelongToCurrentUser(req: any, res: express.Response, next: express.NextFunction):void ;

  userExist(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

  isAuthenticated(req: any, res: express.Response, next: express.NextFunction): void;
  // roles
  isRolesExist(roles: [string]): boolean;


  isInRole(roleName: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
}
export interface Iauthenticate {
  (type: any, opts?: any): (req: any, res: any, next: any) => Promise<any>
}