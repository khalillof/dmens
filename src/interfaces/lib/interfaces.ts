import express from 'express'
import { Model, Schema } from 'mongoose';

export interface IConfigPropsParameters {
    name: string
   active? : Boolean;
   useAuth?: String[]
   useAdmin?: String[]
   schemaObj: object
   schemaOptions?: Record<string,any>
 };

export interface IConfigProps {
   name: string
   active : Boolean;
   useAuth: String[]
   useAdmin: String[]
   schemaObj: object
   schemaOptions?: Record<string,any>
   getConfigProps?(): IConfigProps
   setConfigProps?(props:IConfigProps): void
 };

export interface IDbModel extends IConfigProps {
  
  readonly model?: Model<any>;
  count:number

  getConfigProps():IConfigProps
  checkAuth(method:string):Array<boolean>
  initPostDatabaseSeeding(): Promise<any>;

  Tolist(filter?: Record<string,any>,limit?: number, page?: number, sort?: number ): Promise<any[]>;
  findById(id: string): Promise<any>
  findOne(filter: Record<string,any>): Promise<any>;
  create(obj: object): Promise<any>;
  putById(id: string, objFields: Record<string,any>): Promise<any>;

  deleteById(id: string): Promise<any>;
  deleteByQuery(filter: Record<string,any>): Promise<any>;
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
  data: (item: any, message?: string, total?:number,) => void;
  errCb: (err: any, cb: Function) => void;
  errSuccess: (err: any) => void;
  callback: (cb: Function, obj?: any) => void;
  json: (obj: object) => void;
};
// function with parmeters interface 
export interface Iresponce {
  (res: express.Response, cb?: Function): Iresponces;
}
// function with parmeters interface 
export interface IRouteCallback {
  (this: IDefaultRoutesConfig): void;
}
// function with parmeters interface 
export interface IRouteConfigCallback {
  routeName:string
  controller:IController
  routeCallback?: IRouteCallback
}
export interface Ilogger {
  log: (msg: string) => void;
  err: (err: any) => void;
  resErrMsg: (res: express.Response, ErorMsg?: string) => void;
  resErr: (res: express.Response, err: any) => void;
};

export interface IController {

  db: IDbModel;
  responce: Iresponce;
  log: Ilogger;
  list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  getOne(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  post(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  patch(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  put(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
  tryCatch(actionNam: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;

};


export interface IDefaultRoutesConfig {
  app: express.Router;
  routeName: string;
  routeParam: string;
  controller?: IController;
  mware?: IMiddlewares;
  authenticate: Iauthenticate;
  //actions:Function;
  buildMdWares(middlewares?: Array<Function>, useAuth?: boolean, useAdmin?:boolean): Promise<any[]>;
  // custom routes
  buidRoute(routeName:string,method:string,actionName?:string | null,secondRoute?:string | null,middlewares?:Array<Function> |null):Promise<any>
  
  options(routPath:string):void;
  param(): void;
  defaultRoutes(): Promise<any>;
  actions(actionName: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
}

export interface IMiddlewares {


  getUserFromReq(req: express.Request): Promise<any>;
  checkLoginUserFields(req: express.Request, res: express.Response, next: express.NextFunction): void;

  validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction): void;

  validateCurrentUserOwnParamId(req: express.Request, res: express.Response, next: express.NextFunction): void;
  
  validateHasQueryEmailBelongToCurrentUser(req: any, res: express.Response, next: express.NextFunction):void;

  validateBodyEmailBelongToCurrentUser(req: any, res: express.Response, next: express.NextFunction):void ;

  userExist(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

  isAuthenticated(req: any, res: express.Response, next: express.NextFunction): void;
  // roles
  isRolesExist(roles: [string]): boolean;
  isJson(req:express.Request, res:express.Response,next:express.NextFunction):void;

  isInRole(roleName: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
}
export interface Iauthenticate {
  (type: any, opts?: any): (req: any, res: any, next: any) => Promise<any>
}