"use strict";
const { corsWithOptions } = require('./cors.config');
const { routeStore, appRouter, dbStore, pluralizeRoute} = require('../../common/customTypes/types.config');
const { DefaultController} = require('../../controllers/');
const {Assert} = require('../../common/customTypes/assert');
const {UsersMiddleware} = require('../../users/middleware/users.middleware');
 
async function getUserMWare(){
  let item= Object.values(routeStore).find(r=>  r.UsersMWare instanceof UsersMiddleware );
  let result = item ? item.UsersMWare : await UsersMiddleware.createInstance();
return await Promise.resolve(result);
}
class DefaultRoutesConfig {

  constructor(rName,controller=null,usersMWare=null,callback=null) {
    this.router = appRouter;
    this.routeName = pluralizeRoute(rName);
    this.routeParam = this.routeName + '/:id';
    this.corsWithOption = corsWithOptions;
    this.controller = controller;
    this.UsersMWare = usersMWare;
/*
    if (!control) {
      this.controller = null;
      this.UsersMWare = null;
    } else {
      this.controller = control;

      let item= Object.values(routeStore).find(r=> r.UsersMWare);
      this.UsersMWare = item && item.UsersMWare ? item.UsersMWare : new UsersMiddleware();
    }
*/
    
    typeof callback === 'function' ? callback(this) : this.defaultRoutes();
    // add instance to routeStore
    routeStore[this.routeName] = this;

    console.log('Added ( ' + this.routeName + ' ) to routeStore');
  }

  static async instance(rName, control, callback) {
    let umwre = control ? await getUserMWare(): null;
    let result =  new DefaultRoutesConfig(rName,control,umwre,callback);
    return await Promise.resolve(result);
  }

  buildMdWares(middlewares, useUserMWars=true){
    let mdwares = [this.corsWithOption];
    if(useUserMWars)
      mdwares = [...mdwares,this.UsersMWare.userIsAuthenticated];
    if(middlewares)
      mdwares = [...mdwares, ...middlewares];
    return mdwares;
  }

  static async createInstancesWithDefault(){
  return  await Promise.resolve(Object.keys(dbStore).forEach(async name =>  {if ('user editor'.indexOf(name) === -1) await DefaultRoutesConfig.instance(name,await DefaultController.createInstance(name))}))
 }
  // custom routes
  getList(middlewares, useUserMWars=true){
   return this.router.get(this.routeName, ...this.buildMdWares(middlewares,useUserMWars), this.actions('list'))
  }
  getId(middlewares, useUserMWars=true){
   return this.router.get(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('getOneById'))
  }
  post(middlewares, useUserMWars=true){
   return this.router.post(this.routeName, ...this.buildMdWares(middlewares,useUserMWars),this.actions('create'))
  }
  put(middlewares, useUserMWars=true){
   return this.router.put(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('put'))
  }
  delete(middlewares, useUserMWars=true){  
    middlewares=  middlewares ? middlewares : [this.UsersMWare?.verifyUserIsAdmin]
   return this.router.delete(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('remove'))
  }
  param(){
    return this.router.param('id', async (req,res,next, id)=>{ 
      try{
        Assert.idString(id); 
        next()
        }catch(err){
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
 
  actions(actionName, tryCatch=true){ 
    return async (req,res,next)=> tryCatch ? await this.controller.tryCatch(req,res,next,actionName): await this.controller[actionName](req,res,next);
}

}


module.exports = {DefaultRoutesConfig,getUserMWare};