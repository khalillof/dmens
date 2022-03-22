import express from 'express';
import {corsWithOptions} from './cors.config';
import {routeStore, dbStore, pluralizeRoute, appRouter} from '../../common'
import {UsersMiddleware} from '../../middlewares';
import { DefaultController, IController } from '../../controllers/';
import {Assert} from '../../common/lib/assert' ;

export async function getUserMWare(){
  let item= Object.values(routeStore).find(r=>  r.mWares instanceof UsersMiddleware );
  let result = item ? item.mWares : await UsersMiddleware.createInstance();
    return await Promise.resolve(result);
}

export class DefaultRoutesConfig {
    router:express.Router;
    routeName: string;
    routeParam: string;
    controller:IController | any;
    corsWithOption:any;
    mWares?:UsersMiddleware ;
    //actions:Function;
    constructor(rName:string,controller?:IController,usersMWare?:UsersMiddleware,callback?:Function) { 
        this.router = appRouter;
        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName+'/:id';
        this.corsWithOption = corsWithOptions;
        this.controller = controller;
        this.mWares = usersMWare;
        //this.actions = this.controller.tryCatch
        
        typeof callback === 'function' ? callback(this): this.defaultRoutes();
           
        // add instance to routeStore
        routeStore[this.routeName]=this;
        console.log('Added ( ' +this.routeName+ ' ) to routeStore');
    }
     
     static async instance(rName: string, control:any, callback?:Function){
        let umwre = control ? await getUserMWare(): undefined;
        let result =  new DefaultRoutesConfig(rName,control,umwre,callback);
      return  await Promise.resolve(result);
    }
    static async createInstancesWithDefault(){
     return   await Promise.resolve(Object.keys(dbStore).forEach(async name =>  {if ('account,editor'.indexOf(name) === -1 ) await DefaultRoutesConfig.instance(name,await DefaultController.createInstance(name))}))
    }

    buildMdWares(middlewares?:Array<Function>, useUserMWars=true){
      let mdwares = [this.corsWithOption];
      if(useUserMWars)
        mdwares = [...mdwares,this.mWares!.isAuthenticated];
      if(middlewares)
        mdwares.concat(middlewares);
        return mdwares;
    }
    // custom routes
    getList(middlewares?:any, useUserMWars=true){
     return this.router.get(this.routeName, ...this.buildMdWares(middlewares,useUserMWars),this.actions('list'))
    }
    getId(middlewares?:any, useUserMWars=true){
     return this.router.get(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('getOneById'))
    }
    post(middlewares?:any, useUserMWars=true){
     return this.router.post(this.routeName, ...this.buildMdWares(middlewares,useUserMWars),this.actions('create'))
    }
    put(middlewares?:any, useUserMWars=true){
     return this.router.put(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('put'))
    }
    delete(middlewares?:any, useUserMWars=true){  
      middlewares=  middlewares ? middlewares : [this.mWares?.isAdmin]
      return this.router.delete(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('remove'))
    }
    param(){
      return this.router.param('id', async (req,res,next, id)=>{ 
        try{
          Assert.idString(id); 
          next()
          }catch(err:any){
            res.json({success:false, error:err.message})
            console.log(err.stack)
          }
      });
    }
    defaultRoutes(){
      this.getList(); 
      this.getId();
      this.post();
      this.put();
      this.delete();
      this.param();
    }

  actions(actionName:string){
   return this.controller.tryCatchActions(actionName)
  }
     //return async (req:express.Request,res:express.Response,next:express.NextFunction)=> tryCatch ? await this.controller.tryCatch(req,res,next,actionName): await this.controller[actionName](req,res,next)
 //}

  }