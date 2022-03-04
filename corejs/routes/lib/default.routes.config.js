"use strict";
const { corsWithOptions } = require('./cors.config');
const { routeStore, appRouter, dbStore, pluralizeRoute} = require('../../common/customTypes/types.config');
const { DefaultController} = require('../../controllers/');
const {Assert} = require('../../common/customTypes/assert');
const {UsersMiddleware} = require('../../users/middleware/users.middleware');


class DefaultRoutesConfig {

  constructor(rName, control, callback) {
    this.router = appRouter;
    this.routeName = pluralizeRoute(rName);
    this.routeParam = this.routeName + '/:id';
    this.corsWithOption = corsWithOptions;

    if (!control) {
      this.controller = null;
      this.UsersMWare = null;
    } else {
      this.controller = control;

      let item= Object.values(routeStore).find(r=> r.UsersMWare);
      this.UsersMWare = item ? item.UsersMWare : new UsersMiddleware();
    }

    
    typeof callback === 'function' ? callback(this) : this.defaultRoutes();
    // add instance to routeStore
    routeStore[this.routeName] = this;

    console.log('Added ( ' + this.routeName + ' ) to routeStore');
  }

  static async instance(rName, control, callback) {this.po
    var result = new DefaultRoutesConfig(rName, control, callback);
    return await Promise.resolve(result);
  }

  buildMdWares(middlewares, useUserMWars=true){
    let mdwares = [this.corsWithOption];
    if(useUserMWars)
      mdwares = [...mdwares,this.UsersMWare.verifyUser,this.UsersMWare.verifyUserIsAdmin];
    if(middlewares)
      mdwares = [...mdwares, ...middlewares];
    return mdwares;
  }

  static async createInstancesWithDefault(){
    await Promise.resolve(Object.keys(dbStore).forEach(async name =>  {if ('user editor'.indexOf(name) === -1) await DefaultRoutesConfig.instance(name,await DefaultController.createInstance(name))}))
 }
  // custom routes
  getList(middlewares, useUserMWars=false){
    this.router.get(this.routeName, ...this.buildMdWares(middlewares,useUserMWars), this.actions('list'))
  }
  getId(middlewares, useUserMWars=false){
    this.router.get(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('getOneById'))
  }
  post(middlewares, useUserMWars=true){
    this.router.post(this.routeName, ...this.buildMdWares(middlewares,useUserMWars),this.actions('create'))
  }
  put(middlewares, useUserMWars=true){
    this.router.put(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('put'))
  }
  delete(middlewares, useUserMWars=true){  
    this.router.delete(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('remove'))
  }

defaultRoutes(){
  this.getList(); 
  this.getId();
  this.post();
  this.put();
  this.delete()
  this.router.param('id', async (req,res,next, id)=>{ Assert.idString(id); next()});
}
 
  actions(actionName, tryCatch=true){ 
    return async (req,res,next)=> tryCatch ? await this.controller.tryCatch(req,res,next,actionName): await this.controller[actionName](req,res,next);
}

}


exports.DefaultRoutesConfig = DefaultRoutesConfig;