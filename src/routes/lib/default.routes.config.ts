import express from 'express';
import {corsWithOptions } from "./cors.config.js";
import {routeStore, pluralizeRoute, Assert, config} from '../../common/index.js'
import {Middlewares} from '../../middlewares/index.js';
import {IController, IDefaultRoutesConfig, IMiddlewares, Iauthenticate} from '../../interfaces/index.js';
import { DefaultController} from '../../controllers/index.js';
import {authenticateUser} from '../../services/index.js' ;
import { IRouteCallback } from 'src/interfaces/lib/interfaces.js';

export  function getMware():IMiddlewares{
  let item= Object.values(routeStore).find(r =>  r.mware !== null );
  let result:IMiddlewares = item && item.mware ? item.mware : new Middlewares();
    return result;
}
const mdwr = new Middlewares();

export class DefaultRoutesConfig implements IDefaultRoutesConfig{
    app:any;
    routeName: string;
    routeParam: string;
    controller?:IController;
    mware?:IMiddlewares;
    authenticate:Iauthenticate;
    //actions:Function;
    constructor(exp:express.Application,rName:string,controller?:IController,callback?:IRouteCallback) { 
        this.app = exp;
        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName+'/:id';
        this.controller = controller || new DefaultController(rName);
        this.mware = mdwr;
        this.authenticate =authenticateUser;
        typeof callback === 'function' ? callback.call(this): this.defaultRoutes();
        
        // add instance to routeStore
        routeStore[this.routeName]=this;
        console.log('Added ( ' +this.routeName+ ' ) to routeStore');
    }

   async buildMdWares(middlewares?:Array<Function> |null, useAuth=true, useAdmin=false){
      let mdwares:any[] = [];
      if(useAuth === true)
        mdwares = [...mdwares,this.authenticate(config.authStrategy())] //  authStr === 'az' ? 'oauth-bearer' :  jwt; ;
      if(useAdmin === true)
      mdwares = [...mdwares,this.mware!.isInRole('admin')];
      if(middlewares)
        mdwares = [...mdwares,...middlewares];
 
      return mdwares;
    }
    // custom routes
   async buidRoute(routeName:string,method:string,actionName?:string | null,secondRoute?:string | null,middlewares?:Array<Function> |null){
      const url = secondRoute ? (routeName +'/'+secondRoute) : routeName;
      let aut:boolean[] = this.controller?.db?.checkAuth(method) || [true,false];
      let  mdwr = await this.buildMdWares(middlewares!,...aut);
      return this.app[(method ==='list'?'get':method)](url, ...mdwr,this.actions(actionName ?? method))
    }
    
    options(routPath:string){
      this.app.options(routPath, corsWithOptions);
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
   async defaultRoutes(){ 
   await  this.buidRoute(this.routeName,'list','search','search');// search
   await  this.buidRoute(this.routeName,'list','count','count'); // count
   await  this.buidRoute(this.routeName,'list','list'); // list
   await   this.buidRoute(this.routeParam,'get','getOne') // get By id
   await   this.buidRoute(this.routeName,'get','getOne') // getOne by filter parameter
   await   this.buidRoute(this.routeName,'post')// post
   await   this.buidRoute(this.routeParam,'put')// put
   await   this.buidRoute(this.routeParam,'delete',null, null,[this.mware!.validateCurrentUserOwnParamId])// delete

      this.param();
      this.options(this.routeName);
      this.options(this.routeParam);
    }

  actions(actionName:string){
   return this.controller!.tryCatch(actionName)
  }
  }