import express from 'express';
import {corsWithOptions} from './cors.config';
import {routeStore, dbStore, pluralizeRoute, Assert} from '../../common'
import {Middlewares, } from '../../middlewares';
import {IController, IDefaultRoutesConfig, IMiddlewares, Iauthenticate} from '../../interfaces';
import { DefaultController} from '../../controllers/';
import {authenticateUser} from '../../services' ;

export async function getMware():Promise<IMiddlewares>{
  let item= Object.values(routeStore).find(r=>  r.mware instanceof Middlewares );
  let result:any = item ? item.mware : await Middlewares.createInstance();
    return await Promise.resolve(result);
}

export class DefaultRoutesConfig implements IDefaultRoutesConfig{
    app:express.Application;
    routeName: string;
    routeParam: string;
    controller:IController | any;
    corsWithOption:any;
    mware?:IMiddlewares ;
    authenticate:Iauthenticate;
    //actions:Function;
    constructor(exp:express.Application,rName:string,controller?:IController,MWare?:IMiddlewares,callback?:Function) { 
        this.app = exp;
        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName+'/:id';
        this.corsWithOption = corsWithOptions;
        this.controller = controller;
        this.mware = MWare;
        this.authenticate =authenticateUser;
        authenticate:
        typeof callback === 'function' ? callback(this): this.defaultRoutes();
        
        // add instance to routeStore
        routeStore[this.routeName]=this;
        console.log('Added ( ' +this.routeName+ ' ) to routeStore');
    }
     
     static async instance(exp:express.Application,rName: string, control:any, callback?:Function){
        let umwre = control ? await getMware(): undefined;
        let result =  new DefaultRoutesConfig(exp,rName,control,umwre,callback);
      return  await Promise.resolve(result);
    }
    static async createInstancesWithDefault(app:express.Application){
     return   await Promise.resolve(Object.keys(dbStore).forEach(async name =>  {if ('account,editor'.indexOf(name) === -1 ) await DefaultRoutesConfig.instance(app,name,await DefaultController.createInstance(name))}))
    }

    buildMdWares(middlewares?:Array<Function>, useUserMWars=true){
      let mdwares = [this.corsWithOption];
      if(useUserMWars)
        mdwares = [...mdwares,this.authenticate("jwt")];
      if(middlewares)
        mdwares.concat(middlewares);
        return mdwares;
    }
    // custom routes
    getList(middlewares?:any, useMWars=true){
     return this.app.get(this.routeName, ...this.buildMdWares(middlewares,useMWars),this.actions('list'))
    }
    getId(middlewares?:any, useUserMWars=true){
     return this.app.get(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('findById'))
    }
    post(middlewares?:any, useUserMWars=true){
     return this.app.post(this.routeName, ...this.buildMdWares(middlewares,useUserMWars),this.actions('create'))
    }
    put(middlewares?:any, useUserMWars=true){
     return this.app.put(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('put'))
    }
    delete(middlewares?:any, useUserMWars=true){  
      middlewares=  middlewares ? middlewares : [this.mware!.validateSameEmailBelongToSameUser]
      return this.app.delete(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('remove'))
    }
    param(){
      return this.app.param('id', async (req,res,next, id)=>{ 
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
  }