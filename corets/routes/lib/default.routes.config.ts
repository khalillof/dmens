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

        
        typeof callback === 'function' ? callback(this): this.configureRoutes();
           
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

    custumMiddleWare(rName?:string) {
      if (rName) {
        this.routeName = rName;
        this.routeParam = this.routeName + '/:id';
      }
      return {
        getList:  (callback:[]) => this.router.get(this.routeName, this.corsWithOption,...callback, this.actions('list')),
        getId: (callback:[]) => this.router.get(this.routeParam,this.corsWithOption, ...callback, this.tryCatchAction('getOneById')),
        post: (callback:[]) => this.router.post(this.routeName, this.corsWithOption, ...callback, this.tryCatchAction('create')),
        put: (callback:[]) => this.router.put(this.routeParam, this.corsWithOption, ...callback, this.tryCatchAction('put')),
        delete: (callback:[]) => this.router.delete(this.routeParam, this.corsWithOption, ...callback, this.tryCatchAction('remove'))
      }
    }
    configureRoutes() {
      this.router.all(this.routeName,this.corsWithOption);
      this.router.all(this.routeParam,this.corsWithOption);
      
      this.router.get(this.routeName, this.actions('list'))
      this.router.get(this.routeParam, this.tryCatchAction('getOneById'))
      this.router.post(this.routeName, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.tryCatchAction('create'))
      this.router.put(this.routeParam, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.tryCatchAction('put'))
      this.router.delete(this.routeParam, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.tryCatchAction('remove'));
      this.router.param('id', async (req,res,next, id)=>{ Assert.string(id, {required:true, notEmpty:true}); next()});
      
  
    }
  
 
 actions(actionName:string){ 
     return async (req:express.Request,res:express.Response,next:express.NextFunction)=> await this.controller[actionName](req,res,next)
     
 }
 tryCatchAction(actionName:string){
  return async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
    try{
      await this.controller[actionName](req,res,next)
    }catch(err:any){
      console.error(err.stack)
      res.json({sucess:false, error: 'error operation faild!'})
    }  
  }
}

  }