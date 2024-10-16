import { corsWithOptions } from "./cors.config.js";
import { Assert, envs } from '../../common/index.js'
import {Store} from '../../services/index.js'
import { middlewares } from '../../middlewares/index.js';
import { IModelConfig, IController, IDefaultRoutesConfig, IMiddlewares,IRouteCallback } from '../../interfaces/index.js';
import { DefaultController } from '../../controllers/index.js';
import { appRouter } from '../../index.js'


export class DefaultRoutesConfig implements IDefaultRoutesConfig {
  router: any
  config: IModelConfig
  controller: IController
  mware?: IMiddlewares
  baseRoute:string
  routeParam: string;
  constructor(controller: IController, callback?: IRouteCallback) {
    if (!(controller instanceof DefaultController)) {
      envs.throwErr('route configration require instance of class DefaultController')
    }

    
    this.controller = controller
    this.config = controller.db.config;
    this.baseRoute = '/'+controller.db.config.routeName
    this.routeParam = this.baseRoute + `/${controller.db.config.name+'Id'}`
    this.router = appRouter;
    this.mware = middlewares;

    if(typeof callback === 'function'){
     callback.call(this)
    }else{
      this.defaultRoutes();
      this.defaultExtraRoutes()
      
    } 

    // add instance to routeStore
    Store.route.add(this);

  }

  setOptions(routPath: string) {
    this.router.options(routPath, corsWithOptions);
  }
  options() {
    this.setOptions(this.config.routeName);
   this.setOptions(this.routeParam);
  }
  setParam() {
    return this.router.param(this.config.name+'Id', async (req: any, res: any, next: any, id: string) => {
      try {
        Assert.idString(id);
        next()
      } catch (err: any) {
        res.json({ success: false, error: err.message })
        envs.logLine(err.stack)
      }
    });
  }

 async addGetExtraRoute(pathActionname:string, middlewares?:string[]){
 await this.get(`${this.baseRoute}/${pathActionname}`,pathActionname,middlewares)
}
  async defaultExtraRoutes() { // routedata
   for(let pathAction of ['search','count','form','route','viewdata']){
    await this.addGetExtraRoute(pathAction);
   }
  await this.addGetExtraRoute('test', ['authenticate']); // tet auth

  }
  async defaultRoutes() { // routedata

    await this.list(); // list   
    await this.get() // get by id
   // await this.get(this.config.routeName+'/one') // getOne by filter parameter
    await this.post()// post
    await this.update()// put
    await this.delete()// delete

    this.setParam();
    this.options();
  }

  
 async setMiddlewars(action:string,middlewares:string[]=[]){
  let mware:any = this.mware;
  let mdrs = [...middlewares, ...this.config.authAdminMiddlewares!(action)].map((m) => {
   return m==='authenticate' ? mware[m]() : mware[m];
  }
  );
  
  //debug only console.log(`mode name :${this.config.name}:  >>>> action :${action} `)
  return [...mdrs,this.actions(action)];
}

async list(path?:string,action?:string, middlewares?:string[]){
await this.router.get(path ??this.baseRoute, await this.setMiddlewars(action! ?? 'list', middlewares));

}
async get(path?:string,action?:string, middlewares?:string[]){
await this.router.get((path ?? this.routeParam),await this.setMiddlewars(action??'get', middlewares))
}
async post(path?:string,action?:string, middlewares?:string[]){
await this.router.post((path ?? this.baseRoute),await this.setMiddlewars(action ??'create', [...(middlewares ? middlewares : [])]))
}
async update(path?:string,action?:string, middlewares?:string[]){
await this.router.put(path??this.routeParam, await this.setMiddlewars(action??'update', [...(middlewares ? middlewares : [])]));
}
async delete(path?:string,action?:string, middlewares?:string[]){
await this.router.delete(path || this.routeParam, await this.setMiddlewars(action??'delete', [...(middlewares ? middlewares! : []),'validateCurrentUserOwnParamId']));
}


  actions(actionName: string) {
    return this.controller!.tryCatch(actionName)
  }

}
