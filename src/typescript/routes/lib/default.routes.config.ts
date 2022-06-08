import express from 'express';
import cors from "cors";
import {routeStore, dbStore, pluralizeRoute, Assert} from '../../common/index.js'
import {Middlewares} from '../../middlewares/index.js';
import {IController, IDefaultRoutesConfig, IMiddlewares, Iauthenticate} from '../../interfaces/index.js';
import { DefaultController} from '../../controllers/index.js';
import {authenticateUser} from '../../services/index.js' ;

export async function getMware():Promise<IMiddlewares>{
  let item= Object.values(routeStore).find(r =>  r.mware !== null );
  let result:IMiddlewares = item && item.mware ? item.mware : await Middlewares.createInstance();
    return await Promise.resolve(result);
}

export class DefaultRoutesConfig implements IDefaultRoutesConfig{
    app:any;
    routeName: string;
    routeParam: string;
    controller?:IController;
    mware?:IMiddlewares ;
    authenticate:Iauthenticate;
    //actions:Function;
    constructor(exp:express.Application,rName:string,controller?:IController,MWare?:IMiddlewares,callback?:Function) { 
        this.app = exp;
        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName+'/:id';
        this.controller = controller;
        this.mware = MWare;
        this.authenticate =authenticateUser;
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
     return   await Promise.resolve(Object.keys(dbStore).forEach(async name =>  {if ('account admin'.indexOf(name) === -1 ) await DefaultRoutesConfig.instance(app,name,await DefaultController.createInstance(name))}))
    }

    buildMdWares(middlewares?:Array<Function>, useAuth=true, useAdmin=false){
      let mdwares:any[] = [];
      if(useAuth)
        mdwares = [...mdwares,this.authenticate("jwt")];
      if(useAdmin)
      mdwares = [...mdwares,this.mware!.isInRole('admin')];
      if(middlewares)
        mdwares.concat(middlewares);
        return mdwares;
    }
    // custom routes
    getList(middlewares=null, useAuth=true,useAdmin=false){
     
     return this.app.get(this.routeName, ...this.buildMdWares(middlewares!,useAuth, useAdmin),this.actions('list'))
    }
    getId(middlewares=null, useAuth=true,useAdmin=false){
     return this.app.get(this.routeParam, ...this.buildMdWares(middlewares!,useAuth, useAdmin),this.actions('findById'))
    }
    post(middlewares=null, useAuth=true,useAdmin=false){
     return this.app.post(this.routeName, ...this.buildMdWares(middlewares!,useAuth, useAdmin),this.actions('create'))
    }
    put(middlewares=null, useAuth=true,useAdmin=false){
     return this.app.put(this.routeParam, ...this.buildMdWares(middlewares!,useAuth, useAdmin),this.actions('put'))
    }
    delete(middlewares=null, useAuth=true, useAdmin=false){  
      let mdl =  middlewares ? middlewares : [this.mware!.validateCurrentUserOwnParamId]
      return this.app.delete(this.routeParam, ...this.buildMdWares(mdl,useAuth, useAdmin),this.actions('remove'))
    }
    options(routPath:string){
      this.app.options(routPath, cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));
    }
    param(){
      return this.app.param('id', async (req:any,res:any,next:any, id:string)=>{ 
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

      this.options(this.routeName);
      this.options(this.routeParam);
    }

  actions(actionName:string){
   return this.controller!.tryCatchActions(actionName)
  }
  }