import express from 'express';
import {corss, corsWithOptions} from './cors.config';
import {routeStore, dbStore, pluralizeRoute, appRouter} from '../../common/customTypes/types.config'
import UsersMiddleware from '../../users/middleware/users.middleware';
import { DefaultController, IController } from '../../controllers/';
import {Assert} from '../../common/customTypes/assert' ;


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
    custumMiddleWare(rName?:string) {
      if (rName) {
        this.routeName = rName;
        this.routeParam = this.routeName + '/:id';
      }
      return {
        getList: (callback:[]) => this.router.get(this.routeName, this.cors, ...callback, this.actions('list')),
        getId: (callback:[]) => this.router.get(this.routeParam, this.cors, ...callback, this.actions('getById')),
        post: (callback:[]) => this.router.post(this.routeName, this.cors, this.corsWithOption, ...callback, this.actions('create')),
        put: (callback:[]) => this.router.put(this.routeParam, this.cors, this.corsWithOption, ...callback, this.actions('put')),
        delete: (callback:[]) => this.router.delete(this.routeParam, this.cors, this.corsWithOption, ...callback, this.actions('remove'))
      }
    }
    configureRoutes() {
      this.router.get(this.routeName, this.cors, this.actions('list'))
      this.router.get(this.routeParam, this.cors, this.actions('getById'))
      this.router.post(this.routeName, this.corsWithOption, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.actions('create'))
      this.router.put(this.routeParam, this.corsWithOption, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.actions('put'))
      this.router.delete(this.routeParam, this.corsWithOption, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.actions('remove'));
      this.router.param('id', async (req,res,next, id)=>{ Assert.string(id, {required:true, notEmpty:true}); next()});
      
  
    }
  
    actions(name:string) {
        return async (req: express.Request, res:express.Response, next:express.NextFunction) => {
        return await this.controller[name](req, res, next);
      }
    }
  
  }