import { corsWithOptions } from "./cors.config.js";
import { Assert, envs } from '../../common/index.js'
import {Store} from '../../services/index.js'
import { middlewares } from '../../middlewares/index.js';
import { IModelConfig, IController, IDefaultRoutesConfig, IMiddlewares,IRouteCallback } from '../../interfaces/index.js';
import { DefaultController } from '../../controllers/index.js';
import { appRouter } from '../../index.js'

// defaultActions =['list','get', 'create', 'update','patch', 'delete', 'search', 'count', 'form', 'route', 'modeldata']
//const isDefaultActions = (action: string) => defaultActions.indexOf(action) !== -1;

export class DefaultRoutesConfig implements IDefaultRoutesConfig {
  router: any
  config: IModelConfig
  controller: IController
  mware?: IMiddlewares
  baseRoutePath:string
  baseRouteParam:string
  routeName?: string | undefined;
  constructor(controller: IController, callback?: IRouteCallback) {
    if (!(controller instanceof DefaultController)) {
      envs.throwErr('route configration require instance of class DefaultController')
    }

    this.controller = controller
    this.config = controller.db.config;
    this.routeName = controller.db.config.routeName;
    this.baseRoutePath = controller.db.config.baseRoutePath;
    this.baseRouteParam = controller.db.config.routeParam;
    this.router = appRouter;
    this.mware = middlewares;

    if(typeof callback === 'function'){
     callback.call(this)
    }else{
      this.defaultRoutes();
      this.defaultClientRoutes()
      
    } 

    // add instance to routeStore
    Store.route.add(this);

  }

  addPath(name: string, param?: boolean): string {
    if (param)
      return this.baseRouteParam + (name.startsWith('/') ? name : '/' + name);
    return this.baseRoutePath + (name.startsWith('/') ? name : '/' + name);
  }


  setOptions(routPath: string) {
    this.router.options(routPath, corsWithOptions);
  }
  options() {
    this.setOptions(this.baseRoutePath);
    this.setOptions(this.baseRouteParam);
  }
  setParam() {
    return this.router.param(this.config.paramId, async (req: any, res: any, next: any, id: string) => {
      try {
        Assert.idString(id);
        next()
      } catch (err: any) {
        res.json({ success: false, error: err.message })
        envs.logLine(err.stack)
      }
    });
  }


  async defaultClientRoutes() { // routedata

    await this.get(this.addPath('/search'),'search');// search
    await this.get(this.addPath('/count'),'count'); // count
    await this.get(this.addPath('/form'),'form'); // get form elements
    await this.get(this.addPath('/route'),'route'); // get form routes
    await this.get(this.addPath('/viewdata'),'viewData'); // get model routeData
  }
  async defaultRoutes() { // routedata

    await this.list(); // list   
    await this.get() // get by id
    await this.get(this.addPath('/one')) // getOne by filter parameter
    await this.create()// post
    await this.update()// put
    await this.patch()// patch
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
await this.router.get(path ??this.baseRoutePath, await this.setMiddlewars(action! ?? 'list', middlewares));

}
async get(path?:string,action?:string, middlewares?:string[]){
await this.router.get(path?? this.baseRouteParam,await this.setMiddlewars(action??'getOne', middlewares))
}
async create(path?:string,action?:string, middlewares?:string[]){
await this.router.post(path ?? this.addPath('/create') ,await this.setMiddlewars(action ??'create', [...(middlewares ? middlewares : []), ...this.config.postPutMiddlewares]))
}
async update(path?:string,action?:string, middlewares?:string[]){
await this.router.put(path??this.addPath('/update', true), await this.setMiddlewars(action??'update', [...(middlewares ? middlewares : []), ...this.config.postPutMiddlewares]));
}
async delete(path?:string,action?:string, middlewares?:string[]){
await this.router.delete(path || this.addPath('/delete', true), await this.setMiddlewars(action??'delete', [...(middlewares ? middlewares! : []),'validateCurrentUserOwnParamId']));
}

async patch(path?:string,action?:string, middlewares?:string[]){

await this.router.patch(path || this.addPath('/patch', true), await  this.setMiddlewars(action??'patch', middlewares));
}

  actions(actionName: string) {
    return this.controller!.tryCatch(actionName)
  }

}
