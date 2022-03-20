"use strict";
const { corsWithOptions } = require('./cors.config');
const { routeStore, appRouter, dbStore, pluralizeRoute, Assert} = require('../../common');
const {DefaultController} = require('../../controllers');
const {UsersMiddleware} = require('../../middlewares');
 
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
    this.mWares = usersMWare;
    
    typeof callback === 'function' ? callback.call(this) : this.defaultRoutes();
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
      mdwares = [...mdwares,this.mWares.userIsAuthenticated];
    if(middlewares)
      mdwares.concat(middlewares);
    return mdwares;
  }

  static async createInstancesWithDefault(){
  return  await Promise.resolve(Object.keys(dbStore).forEach(async name =>  {if ('account editor'.indexOf(name) === -1) await DefaultRoutesConfig.instance(name,await DefaultController.createInstance(name))}))
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
    middlewares=  middlewares ?? [this.mWares.verifyUserIsAdmin]
   return this.router.delete(this.routeParam, ...this.buildMdWares(middlewares,useUserMWars),this.actions('remove'))
  }
  param(){
    return this.router.param('id', async (req,res,next, id)=>{ 
      try{
        Assert.idString(id); 
        next()
        }catch(err){
          res.json({success:false, error:err.message})
          console.error(err.stack)
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
 
  actions(actionName, useTryCatch=true){ 
    return async (req,res,next)=> useTryCatch ? await this.controller.tryCatch(req,res,next,actionName): await this.controller[actionName](req,res,next);
}

}


module.exports = {DefaultRoutesConfig,getUserMWare};