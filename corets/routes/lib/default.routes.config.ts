import express from 'express';
import {corsWithOptions} from './cors.config';
import {routeStore, dbStore, pluralizeRoute, appRouter} from '../../common/customTypes/types.config'
import UsersMiddleware from '../../users/middleware/users.middleware';
import { DefaultController, IController } from '../../controllers/';
import {Assert} from '../../common/customTypes/assert' ;

export class DefaultRoutesConfig {
    router:express.Router;
    routeName: string;
    routeParam: string;
    controller:IController | any;
    corsWithOption:any;
    UsersMWare:UsersMiddleware | any;

    constructor(rName: string, control:IController, callback?:Function) { 
        this.router = appRouter;
        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName+'/:id';
        this.corsWithOption = corsWithOptions;

        if (!control){
          this.controller = null;
          this.UsersMWare = null;
        }else{
          this.controller = control;

          let item= Object.values(routeStore).find(r=> r.UsersMWare);
          this.UsersMWare = item ? item.UsersMWare : new UsersMiddleware();
        } 

        
        typeof callback === 'function' ? callback(this): this.defaultRoutes();
           
        // add instance to routeStore
        routeStore[this.routeName]=this;
        console.log('Added ( ' +this.routeName+ ' ) to routeStore');

    }
     
     static async instance(rName: string, control:any, callback?:any){
        var result =  new DefaultRoutesConfig(rName,control,callback);
      return  await Promise.resolve(result);
    }
    static async createInstancesWithDefault(){
        await Promise.resolve(Object.keys(dbStore).forEach(async name =>  {if ('user,editor'.indexOf(name) === -1 ) await DefaultRoutesConfig.instance(name,await DefaultController.createInstance(name))}))
    }

    buildMdWares(middlewares?:Array<Function>, useUserMWars=true){
      let mdwares = [this.corsWithOption];
      if(useUserMWars)
        mdwares = [...mdwares,this.UsersMWare.verifyUser,this.UsersMWare.verifyUserIsAdmin];
      if(middlewares)
        mdwares = [...mdwares, ...middlewares];
        return mdwares;
    }
    // custom routes
    getList(middlewares?:any, useUserMWars=false){
      this.router.get(this.routeName, ...this.buildMdWares(middlewares,useUserMWars),this.actions('list'))
    }
    getId(middlewares?:any, useUserMWars=false){
      this.router.get(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('getOneById'))
    }
    post(middlewares?:any, useUserMWars=true){
      this.router.post(this.routeName, ...this.buildMdWares(middlewares,useUserMWars),this.actions('create'))
    }
    put(middlewares?:any, useUserMWars=true){
      this.router.put(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('put'))
    }
    delete(middlewares?:any, useUserMWars=true){  
      this.router.delete(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('remove'))
    }
  
    defaultRoutes(){
      this.getList(); 
      this.getId();
      this.post();
      this.put();
      this.delete()
      this.router.param('id', async (req,res,next, id)=>{ Assert.idString(id); next()});
    }

 actions(actionName:string, tryCatch=true){ 
     return async (req:express.Request,res:express.Response,next:express.NextFunction)=> tryCatch ? await this.controller.tryCatch(req,res,next,actionName): await this.controller[actionName](req,res,next)
 }

  }