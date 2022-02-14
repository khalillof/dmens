"use strict";
const {corss, corsWithOptions} = require('./cors.config');
const {routeStore,appRouter, dbStore, pluralizeRoute} = require('../common/customTypes/types.config');
const { DefaultController } = require('../controllers/default.controller');
const {UsersMiddleware} = require('../users/middleware/users.middleware')
class DefaultRoutesConfig {
    
    constructor(rName, control, callback) {
        this.router =appRouter;

        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName + '/:id';
        this.cors = corss;
        this.corsWithOption = corsWithOptions;
        
        if (!control){
          this.controller = null;
          this.UsersMWare = null;
        }else{
          this.controller = control;
          this.UsersMWare = new UsersMiddleware();
        } 

        typeof callback === 'function' ? callback(this) : this.configureRoutes();
        // add instance to routeStore
        routeStore[this.routeName] = this;
        console.log('Added ( '+this.routeName+' ) to routeStore');
    }

    static async instance(rName, control, callback ){
        var result =  new DefaultRoutesConfig(rName,control,callback);
      return  await Promise.resolve(result);
    }

    static async createInstancesWithDefault(){
        Object.keys(dbStore).forEach(async name =>  await DefaultRoutesConfig.instance(name, await DefaultController.createInstance(name)))
    }
    
  custumMiddleWare(rName){
    if(rName){
      this.routeName = rName;
      this.routeParam = this.routeName + '/:id';
    }
  return {
  getList:(...callback)=> this.router.get(this.routeName,this.cors,...callback,this.controller.ToList(this.controller)) ,
  getId:(...callback)=> this.router.get(this.routeParam,this.cors,...callback,this.controller.getById(this.controller)),
  post:(...callback)=> this.router.post(this.routeName,this.cors,this.corsWithOption,...callback,this.controller.create(this.controller)),
  put:(...callback)=> this.router.put(this.routeParam,this.cors,this.corsWithOption,...callback,this.controller.put(this.controller)),
  delete:(...callback)=> this.router.delete(this.routeParam,this.cors,this.corsWithOption,...callback,this.controller.remove(this.controller))
}
}
    configureRoutes(){  
           this.router.get(this.routeName,this.cors,this.controller.ToList(this.controller))
           this.router.get(this.routeParam,this.cors,this.controller.getById(this.controller))
           this.router.post(this.routeName,this.corsWithOption,this.controller.create(this.controller))  
           this.router.put(this.routeParam,this.corsWithOption,this.controller.put(this.controller))
           this.router.delete(this.routeParam,this.corsWithOption,this.controller.remove(this.controller));
    }     
     
}

exports.DefaultRoutesConfig = DefaultRoutesConfig;