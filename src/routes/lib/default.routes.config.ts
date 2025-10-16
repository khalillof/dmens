import mongoose from "mongoose";
import { Middlewares } from '../../middlewares/index.js';
import { responces, IActiveRoutes, IController, IDefaultRoutesConfig, IMethod, IRouteCallback, appData, IConfigration, IRouteManager, appMethods } from '../../common/index.js';
import { ConfigController, DefaultController } from '../../controllers/index.js';
import { Request, Response, NextFunction, IRouter , Router} from "express";
import { corsWithOptions } from "./cors.config.js";
import { RouteManager } from "./routeManager.js";
import {oidcJwtMiddleware} from "../../services/lib/auth.js"


export class DefaultRoutesConfig implements IDefaultRoutesConfig {
  router: IRouter
  config: IConfigration
  controller: IController
  baseRoute: string
  paramId: string
  activeRoutes: IActiveRoutes = { get: [], post: [], put: [], delete: [], options: [] }
  routeManager : IRouteManager

  constructor(config: IConfigration, callback?: IRouteCallback) {
    let { name, routeName, paramId } = config;

    this.controller = name === 'config' ? new ConfigController(config) : new DefaultController(config);
    this.config = this.controller.config;
    this.baseRoute = '/' + routeName
    this.paramId = ":" + paramId;
    this.router = Router({ mergeParams: true, strict: true });
    
    if (typeof callback === 'function') {
      callback.call(this)
    } else {
      this.defaultRoutes();
    }
    this.routeManager = new RouteManager(this);
    appData.set(config.name, this);
    console.log('just added new data Container modelName is : ', config.name)
  }


  async addRoute(method: IMethod, path?: string, action?: string, middlewares?: string[] ) {

    if (!method) {
      throw new Error('method is required to add route');
    }
    path = this.addRoutePath(method, path);
    // check if action is undefind assigned to method
    action ??= method;
    
    let cont: any = this.controller;
    // check action 
    if (!cont[action!]) {
      throw new Error(`Route name -(${this.baseRoute}) -- action --( ${action} ) not found`)
    }
    if(this.config.disabledActions.isFound(action)){
      throw new Error(`baseRoute : ${this.baseRoute} - path :${path} - action -${action}- is on disabled list of actions`)
    }

    let mddlrs = await this.setMiddlewars(action, middlewares);

    this.router[method](path, mddlrs);
  }

  addRoutePath(method: IMethod, path?: string) {
    let p = path ? this.baseRoute + '/' + path : this.baseRoute;

    if (!appMethods.isFound(method)) {
      throw new Error('method is not valid method ' + method)
    }

    if (this.activeRoutes[method].isFound(p)) {
      throw new Error(`method - (${method}), and path - (${p}), already has active route`)
    }

    this.activeRoutes[method].push(p);
    return p;
  }

  setParam(paramId: string) {
    this.router.param(paramId, (req: Request, res: Response, next: NextFunction, id: string) =>
      mongoose.isObjectIdOrHexString(id) ? next() : next(new Error('error - Id provided is not vaid :' + id)));
  }

  addOptions(path?: string) {
    this.router.options(this.addRoutePath('options', path),corsWithOptions);
  }


  async defaultRoutes() {

    await this.addRoute("get",undefined, 'list' );
    await this.addRoute("get", this.paramId );
    await this.addRoute("post",undefined,"create" );
    await this.addRoute("put", this.paramId, "update");
    await this.addRoute("delete", this.paramId);

    await this.addRoute("get", "count" , "count");
    await this.addRoute("get", "search" , "search");

    this.setParam( this.config.paramId);
    this.addOptions();
    this.addOptions(this.paramId);

    await this.addEndPoints()
  }

  async addEndPoints() {
    if (this.config.endPoints?.length) {
      for await (let { host, name, routes } of this.config.endPoints) {
        for await (let route of routes) {
          let { method, paramId, authorize, admin, path } = route;
          path = paramId ? name + '/:' + paramId : name;

          let middlewares = authorize ? [oidcJwtMiddleware()] : []
          admin && middlewares.push(Middlewares.isAdmin);
          middlewares.push(this.actions("endPoint", [host, route]));

          this.router[method](this.addRoutePath(method, path), middlewares);
        }
      }
    }
  }
  async setMiddlewars(action: string, middlewares: string[] = []): Promise<any> {
    let mdl: any = Middlewares;
        mdl.authorize = oidcJwtMiddleware();
    // check if require auth
    if(this.config.authorize.has(action)){
      middlewares.push('authorize');
      // check if require admin role
     if (this.config.authorize.get(action)) {
      middlewares.push('isAdmin');
    }
  }

   // remove disabled actions then remove diplicates
    middlewares = middlewares.removeDiplicates();

    // console.log(this.baseRoute + ": ",action, middlewares);

    return (middlewares.length > 0) ? [...middlewares.map((s) => mdl[s]), this.actions(action)] : [this.actions(action)];
  }

  ////// helpers ================================
  actions(actionName: string, names?: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let controller: any = this.controller;
        await names ? controller[actionName](...names)(req, res, next) : controller[actionName](req, res, next);
        return;
      } catch (err) {
        return responces.error(res, err);
      }
    }
  }

}
