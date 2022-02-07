"use strict";
const {corss, corsWithOptions} = require('./cors.config');
const {routeStore, dbStore, pluralizeRoute} = require('../common/customTypes/types.config');
const {UsersMiddleware} = require('../users/middleware/users.middleware');
const { DefaultController } = require('../controllers/default.controller');

class DefaultRoutesConfig {
    
    constructor(exp, rName, control, callback) {
        this.app = exp;
        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName + '/:id';
        this.cors = corss;
        this.corsWithOption = corsWithOptions;
        this.UsersMWare = typeof control === 'undefined' ? null : new UsersMiddleware(); 
        this.controller = typeof control === 'undefined' ? null : control;
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
        Object.keys(dbStore).forEach(async name =>  {if (name !== 'user') await DefaultRoutesConfig.instance(exp, name, await DefaultController.createInstance(name))})
    }

    configureRoutes(){  
           this.app.get(this.routeName,this.cors,this.controller.ToList(this.controller))
           this.app.get(this.routeParam,this.cors,this.controller.getById(this.controller))
           this.app.post(this.routeName,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin(this.UsersMWare.controller),this.controller.create(this.controller))  
           this.app.put(this.routeName,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin(this.UsersMWare.controller),this.controller.put(this.controller))
           this.app.patch(this.routeName,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin(this.UsersMWare.controller),this.controller.patch(this.controller)) 
           this.app.delete(this.routeParam,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin(this.UsersMWare.controller),this.controller.remove(this.controller));
    }     
     
}

exports.DefaultRoutesConfig = DefaultRoutesConfig;