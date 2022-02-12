"use strict";
const {corss, corsWithOptions} = require('./cors.config');
const {routeStore, dbStore, pluralizeRoute} = require('../common/customTypes/types.config');
const { DefaultController } = require('../controllers/default.controller');

class DefaultRoutesConfig {
    
    constructor(exp, rName, control, callback) {
        this.app = exp;
        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName + '/:id';
        this.cors = corss;
        this.corsWithOption = corsWithOptions;
        
        if (!control){
            this.controller = null;
          }else{
            this.controller = control;
          } 

        typeof callback === 'function' ? callback(this) : this.configureRoutes();
        // add instance to routeStore
        routeStore[this.routeName] = this;
        console.log('Added ( '+this.routeName+' ) to routeStore');
    }

    static async instance(exp, rName, control, callback ){
        var result =  new DefaultRoutesConfig(exp,rName,control,callback);
      return  await Promise.resolve(result);
    }

    static async createInstancesWithDefault(exp){
        Object.keys(dbStore).forEach(async name =>  await DefaultRoutesConfig.instance(exp, name, await DefaultController.createInstance(name)))
    }
    
  custumMiddleWare(rName){
    if(rName){
      this.routeName = rName;
      this.routeParam = this.routeName + '/:id';
    }
  return {
  getList:(...callback)=> this.app.get(this.routeName,this.cors,...callback,this.controller.ToList(this.controller)) ,
  getId:(...callback)=> this.app.get(this.routeParam,this.cors,...callback,this.controller.getById(this.controller)),
  post:(...callback)=> this.app.post(this.routeName,this.cors,this.corsWithOption,...callback,this.controller.create(this.controller)),
  put:(...callback)=> this.app.put(this.routeParam,this.cors,this.corsWithOption,...callback,this.controller.put(this.controller)),
  delete:(...callback)=> this.app.delete(this.routeParam,this.cors,this.corsWithOption,...callback,this.controller.remove(this.controller))
}
}
    configureRoutes(){  
           this.app.get(this.routeName,this.cors,this.controller.ToList(this.controller))
           this.app.get(this.routeParam,this.cors,this.controller.getById(this.controller))
           this.app.post(this.routeName,this.corsWithOption,this.controller.create(this.controller))  
           this.app.put(this.routeParam,this.corsWithOption,this.controller.put(this.controller))
           this.app.delete(this.routeParam,this.corsWithOption,this.controller.remove(this.controller));
    }     
     
}

exports.DefaultRoutesConfig = DefaultRoutesConfig;