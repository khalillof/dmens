import express, { IRoute, IRouter } from 'express'
import { Model } from 'mongoose';

export interface IRequestFilter { 
  filter?:Record<string, any> 
  limit?:number
  page?:number
  sort?:number
  total?:boolean 
}

export type IElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export interface IModelForm {
  name:string
  initialState:Record<string,any>
  elements: Record<string, any>

}
export interface IStore {
  db: IStoreIntance<IModelDb>
  route: IRouteStore
}
export interface IRouteStore extends IStoreIntance<IDefaultRoutesConfig> {
  print(): void
  getRoutes(routePath?: string): IRoute[]
  getRoutesPathMethods(routeName?: string): { method: string, path: string }[]

  deleteAppRoute(routePath: string): void
  deleteRoutePath(routePath: string):void 

  getRoutesToString(routeName: string): string
  getAllRoutesToString(): string

  getRoutesToJsonString(routeName: string): string
  getAllRoutesToJsonString(): void

  pluralizeRoute(routeName: string): string
}

export interface IStoreIntance<T> {
  storeKey: string
  storeName: string
  store: T[]
  //obj(): T[]
  get(keyValue: string): T | null
  add(obj: T | any): void
  delete(keyValue: string): void
  len(): number
  exist(keyValue: string): boolean
}

export interface IModelConfigParameters {
  name: string
  routeName?: string
  dependent?: Boolean
  schemaObj: object
  schemaOptions?: Record<string, any>
  searchKey?:string
  userAuth?: string[]
  adminAuth?: string[]
  plugins?:string[]
  modelTemplate?:string
  listTemplate?:string

};

export interface IActionData{
  path:string
  reqAuth:boolean
  reqAdmin:boolean
}

export interface IModelViewData {
  name: string
  routeName: string
  modelKeys:string[]
  userAuth: string[]
  adminAuth: string[]
  plugins:string[]
  searchKey?:string

  modelTemplate?:string
  listTemplate?:string
}
export interface IModelConfig extends IModelViewData {
  dependent: Boolean
  schemaObj: object
  schemaOptions?: Record<string, any>
  formCache?:IModelForm
  getRoutes?(): { method: string; path: string;}[]
  getProps?(): IModelConfig
  getViewData?(): IModelViewData
  genForm?(): Promise<IModelForm>
  //check useAuth and useAdmin
  inUserAuth?(actionName:string):boolean
  inAdminAuth?(actionName:string):boolean
  authAdminMiddlewares(actionName: string): string[]
};

export interface IModelDb {
  readonly name: string
  readonly config: IModelConfig
  readonly model?: Model<any>;
  count: number

  initPostDatabaseSeeding(): Promise<any>;
  createConfig(): Promise<any>;
  
  Tolist(filter?: Record<string, any>, limit?: number, page?: number, sort?: number): Promise<any[]>;

}

export interface IConstructor<T> {
  new(...args: any[]): T;
}
export interface Iresponces {
  errObjInfo: (err: any, obj: any, info: any) => void;
  success: (msg?: string) => void;
  fail: (msg?: string) => void;
  errStatus: (status: number, msg: string) => void;
  badRequest: (msg?: string) => void;
  forbidden: (msg?: string) => void;
  unAuthorized: (msg?: string) => void;
  notFound: (msg?: string) => void;
  error: (err: any) => void;
  data: (item: any, message?: string, total?: number) => void;
  errCb: (err: any, cb: Function) => void;
  errSuccess: (err: any) => void;
  callback: (cb: Function, obj?: any) => void;
  json: (obj: object) => void;
  ok:()=> void;
};
// function with parmeters interface 
export interface Iresponce {
  (res: express.Response, cb?: Function): Iresponces;
}
// function with parmeters interface 
export interface IRouteCallback {
  (this: IDefaultRoutesConfig): void;
}

export interface Ilogger {
  log: (msg: string) => void;
  err: (err: any) => void;
  resErrMsg: (res: express.Response, ErorMsg?: string) => void;
  resErr: (res: express.Response, err: any) => void;
};

export type IRequestVerpsAsync = (req: express.Request, res: express.Response, next: express.NextFunction)=> Promise<any>
export type IRequestVerps = (req: express.Request, res: express.Response, next: express.NextFunction)=> any

export interface IController {

  db: IModelDb;
  responce: Iresponce;
  log: Ilogger;

  form:IRequestVerpsAsync;
  route:IRequestVerpsAsync;
  viewdata:IRequestVerpsAsync;

  count:IRequestVerpsAsync;
  search:IRequestVerpsAsync;
  test:IRequestVerpsAsync;
  list:IRequestVerpsAsync;
  get:IRequestVerpsAsync;
  post:IRequestVerpsAsync;
  update:IRequestVerpsAsync;
  delete:IRequestVerpsAsync;
  tryCatch(actionNam: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;

};

export interface IConfigController extends IController{
  forms:IRequestVerpsAsync;
  routes:IRequestVerpsAsync;
  viewsdata:IRequestVerpsAsync;
  deleteRoute:IRequestVerpsAsync;
}
export type IHttpVerp = (path?:string, action?:string ,middlewares?:string[])=>Promise<any>;

export interface IDefaultRoutesConfig {
  router: IRouter
  config:IModelConfig
  controller: IController;
  mware?: IMiddlewares;
  baseRoute:string
  routeParam:string
  setMiddlewars(action:string,middlewares?:string[]):Promise<any[]>

  list:IHttpVerp
  get:IHttpVerp
  post:IHttpVerp
  update:IHttpVerp
  delete:IHttpVerp

  addGetExtraRoute(pathActionname:string, middlewares?:string[]):Promise<void>
  setOptions(routPath: string): void;
  options(): void;
  setParam(): void;
  defaultExtraRoutes(): Promise<any>
  defaultRoutes(): Promise<any>;
  actions(actionName: string): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
}

export interface IMiddlewares {
  authenticate:Iauthenticate;
  getUserFromReq:IRequestVerpsAsync;
  checkLoginUserFields:IRequestVerps;

  validateSameEmailDoesntExist:IRequestVerpsAsync;

  validateCurrentUserOwnParamId:IRequestVerps;

  validateHasQueryEmailBelongToCurrentUser:IRequestVerps;

  validateBodyEmailBelongToCurrentUser:IRequestVerps;

  userExist:IRequestVerpsAsync;
  uploadSchema:IRequestVerps;
  isAuthenticated:IRequestVerps;
  // roles
  //isRolesExist(roles: [string]): boolean;
  isJson:IRequestVerps;

  isInRole(roleName: string): IRequestVerpsAsync;
  isAdmin:IRequestVerps;
}
export interface Iauthenticate {
  (type?: 'jwt' | 'local', opts?: any): IRequestVerpsAsync;
}