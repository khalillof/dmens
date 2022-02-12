import express from 'express';
import {corss, corsWithOptions} from './cors.config';
import {routeStore, dbStore, pluralizeRoute} from '../common/customTypes/types.config'
import UsersMiddleware from '../users/middleware/users.middleware';
import { DefaultController } from '../controllers/default.controller';
import { IController } from '../controllers/Icontroller.controller';

export class DefaultRoutesConfig {
    app:express.Application;
    routeName: string;
    routeParam: string;
    controller:IController | any;
    cors:any;
    corsWithOption:any;
    UsersMWare:UsersMiddleware | any

    constructor(exp: express.Application, rName: string, control:IController|any, callback?:any) { 
        this.app = exp;
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
     
     static async instance(exp: express.Application, rName: string, control:any, callback?:any){
        var result =  new DefaultRoutesConfig(exp,rName,control,callback);
      return  await Promise.resolve(result);
    }
    static async createInstancesWithDefault(exp: express.Application){
          Object.keys(dbStore).forEach(async name =>  {if (name !== 'user') await DefaultRoutesConfig.instance(exp, name, await DefaultController.createInstance(name))})
    }

    configureRoutes(){  
      this.app.get(this.routeName,this.cors,this.controller.ToList(this.controller))
      this.app.get(this.routeParam,this.cors,this.controller.getById(this.controller))
      this.app.post(this.routeName,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.create(this.controller))  
      this.app.put(this.routeParam,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.put(this.controller))
      this.app.delete(this.routeParam,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.remove(this.controller));
}     
     
}

