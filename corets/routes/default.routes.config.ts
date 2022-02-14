import express from 'express';
import {corss, corsWithOptions} from './cors.config';
import {routeStore, dbStore, pluralizeRoute} from '../common/customTypes/types.config'
import UsersMiddleware from '../users/middleware/users.middleware';
import { DefaultController } from '../controllers/default.controller';
import { IController } from '../controllers/Icontroller.controller';
import {appRouter} from '../common/customTypes/types.config';

export class DefaultRoutesConfig {
    router:express.Router;
    routeName: string;
    routeParam: string;
    controller:IController | any;
    cors:any;
    corsWithOption:any;
    UsersMWare:UsersMiddleware | any

    constructor(rName: string, control:IController|any, callback?:any) { 
        this.router = appRouter;
        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName+'/:id';
        this.cors = corss;
        this.corsWithOption = corsWithOptions;

        if (!control){
          this.controller = null;
          this.UsersMWare = null;
        }else{
          this.controller = control;
          this.UsersMWare = new UsersMiddleware();
        } 

        
        typeof callback === 'function' ? callback(this): this.configureRoutes();
           
        // add instance to routeStore
        routeStore[this.routeName]=this;
        console.log('Added ( '+this.routeName+' ) to routeStore');

    }
     
     static async instance(rName: string, control:any, callback?:any){
        var result =  new DefaultRoutesConfig(rName,control,callback);
      return  await Promise.resolve(result);
    }
    static async createInstancesWithDefault(){
          Object.keys(dbStore).forEach(async name =>  {if (name !== 'user') await DefaultRoutesConfig.instance(name, await DefaultController.createInstance(name))})
    }
    custumMiddleWare(rName:string){
      if(rName){
        this.routeName = rName;
        this.routeParam = this.routeName + '/:id';
      }
    return {
    getList:(...callback:[])=> this.router.get(this.routeName,this.cors,...callback,this.controller.ToList(this.controller)) ,
    getId:(...callback:[])=> this.router.get(this.routeParam,this.cors,...callback,this.controller.getById(this.controller)),
    post:(...callback:[])=> this.router.post(this.routeName,this.cors,this.corsWithOption,...callback,this.controller.create(this.controller)),
    put:(...callback:[])=> this.router.put(this.routeParam,this.cors,this.corsWithOption,...callback,this.controller.put(this.controller)),
    delete:(...callback:[])=> this.router.delete(this.routeParam,this.cors,this.corsWithOption,...callback,this.controller.remove(this.controller))
  }
    }
configureRoutes(){  
      this.router.get(this.routeName,this.cors,this.controller.ToList(this.controller))
      this.router.get(this.routeParam,this.cors,this.controller.getById(this.controller))
      this.router.post(this.routeName,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.create(this.controller))  
      this.router.put(this.routeParam,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.put(this.controller))
      this.router.delete(this.routeParam,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.remove(this.controller));
}     
     
}

