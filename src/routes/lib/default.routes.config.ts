import {corsWithOptions } from "./cors.config.js";
import {Svc, Assert, envConfig} from '../../common/index.js'
import {middlewares} from '../../middlewares/index.js';
import {IController, IDefaultRoutesConfig, IMiddlewares, Iauthenticate, IConfigProps, IRouteCallback} from '../../interfaces/index.js';
import { DefaultController} from '../../controllers/index.js';
import {authenticateUser} from '../../services/index.js' ;
import  {Application, IRouter} from "express";
import {app, appRouter} from '../../app.js'
import { ConfigProps } from "../../models/index.js";



export class DefaultRoutesConfig implements IDefaultRoutesConfig{
    app:Application;
    router:IRouter | any
    configProp:IConfigProps
    routeName: string;
    routeParam: string;
    controller?:IController;
    mware?:IMiddlewares;
    authenticate:Iauthenticate;
    //actions:Function;
    constructor(configProp:IConfigProps,controller?:IController,callback?:IRouteCallback) { 
      if(!(configProp instanceof ConfigProps)){
        envConfig.throwErr('route configration require instance of class ConfigProp')
      }
      
        this.configProp = configProp;  
        this.app = app;
        this.router = appRouter;

        this.routeName = configProp.routeName;
        this.routeParam = this.routeName+'/:id';
        this.controller = controller || new DefaultController(configProp.name);
        this.mware = middlewares;
        this.authenticate =authenticateUser;
        typeof callback === 'function' ? callback.call(this): this.defaultRoutes();
        
        // add instance to routeStore
        Svc.routes.add(this);
       // this.app.use(this.router)
    }


  private async buildMdWares(middlewares?:Array<Function> |null, useAuth=false, useAdmin=false){
      let mdwares:any[] = [];
      if(useAuth === true)
        mdwares = [...mdwares,this.authenticate(envConfig.authStrategy())] //  authStr === 'az' ? 'oauth-bearer' :  jwt; ;
      if(useAdmin === true)
      mdwares = [...mdwares,this.mware!.isAdmin];
      if(middlewares)
        mdwares = [...mdwares,...middlewares];
 
      return mdwares;
    }
    // custom routes
   async buidRoute(routeName:string,method:string,actionName?:string | null,middlewares?:string[] |null){
      if(!routeName)
      throw new Error('buildRoute method require url or routeName')
    
      let aut:boolean[] = this.configProp.checkAuth!(method) || [true,false];

      // map middlewares string fuction names to actual functions
      let mdwrs:any = this.mware!;
      let mdwares:Function[] = middlewares ? middlewares.map((m)=> mdwrs[m]) : [];

      let  mdwr = await this.buildMdWares(mdwares!,...aut);
      return this.router[((method ==='list')?'get':method)](routeName, ...mdwr,this.actions(actionName ?? method))
    }
    
    setOptions(routPath:string){
      this.router.options(this.routeName, corsWithOptions);
    }
    options(){
      this.setOptions(this.routeName);
      this.setOptions(this.routeParam);
    }
    param(){
      return this.app.param('id', async (req:any,res:any,next:any, id:string)=>{ 
        try{
          Assert.idString(id); 
          next()
          }catch(err:any){
            res.json({success:false, error:err.message})
            envConfig.logLine(err.stack)
          }
      });
    }
   async defaultRoutes(){ 

   await  this.buidRoute(this.routeName+'/search','list','search');// search
   await  this.buidRoute(this.routeName+'/count','list','count'); // count
   await  this.buidRoute(this.routeName+'/form','list','form'); // get form elements
   await  this.buidRoute(this.routeName+'/route','list','route'); // get form elements
   await  this.buidRoute(this.routeName,'list','list'); // list
   await   this.buidRoute(this.routeParam,'get','getOne') // get By id
   await   this.buidRoute(this.routeName,'get','getOne') // getOne by filter parameter
   await   this.buidRoute(this.routeName,'post')// post
   await   this.buidRoute(this.routeParam,'put')// put
   await   this.buidRoute(this.routeParam,'delete',null,['validateCurrentUserOwnParamId'])// delete

      this.param();
      this.options();
    }

  actions(actionName:string){
   return this.controller!.tryCatch(actionName)
  }
  }