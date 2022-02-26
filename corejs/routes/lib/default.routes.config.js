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

    typeof callback === 'function' ? callback(this) : this.configureRoutes();
    // add instance to routeStore
    routeStore[this.routeName] = this;

    console.log('Added ( ' + this.routeName + ' ) to routeStore');
  }

  static async instance(rName, control, callback) {
    var result = new DefaultRoutesConfig(rName, control, callback);
    return await Promise.resolve(result);
  }

  static async createInstancesWithDefault(){
    
   await Promise.resolve(Object.keys(dbStore).forEach(async name =>  {if (name !== 'user' && name !=='editor') await DefaultRoutesConfig.instance(name,await DefaultController.createInstance(name))}))
}

  custumMiddleWare(rName) {
    if (rName) {
      this.routeName = rName;
      this.routeParam = this.routeName + '/:id';
    }
    return {
      getList: (...callback) => this.router.get(this.routeName,this.corsWithOption,...callback, this.actions('list')),
      getId: (...callback) => this.router.get(this.routeParam,this.corsWithOption, ...callback, this.tryCatchAction('getById')),
      post: (...callback) => this.router.post(this.routeName,this.corsWithOption, ...callback, this.tryCatchAction('create')),
      put: (...callback) => this.router.put(this.routeParam, this.corsWithOption,...callback, this.tryCatchAction('put')),
      delete: (...callback) => this.router.delete(this.routeParam,this.corsWithOption, ...callback, this.tryCatchAction('remove'))
    }
  }
  configureRoutes() {
    this.router.all(this.routeName,this.corsWithOption);
    this.router.all(this.routeParam,this.corsWithOption);
    
    this.router.get(this.routeName, this.actions('list'))
    this.router.get(this.routeParam, this.tryCatchAction('getOneById'))
    this.router.post(this.routeName, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.tryCatchAction('create'))
    this.router.put(this.routeParam, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.tryCatchAction('put'))
    this.router.delete(this.routeParam, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.tryCatchAction('remove'));
    this.router.param('id', async (req,res,next, id)=>{ Assert.idString(id); next()});
  }
 
  actions(actionName){ 
    return async (req,res,next)=> await this.controller[actionName](req,res,next)
    
}
tryCatchAction(actionName){
 return async (req, res, next)=>{
   try{
     await this.controller[actionName](req,res,next)
   }catch(err){
     console.error(err.stack)
     res.json({sucess:false, error: 'error operation faild!'})
   }  
 }
}
}



exports.DefaultRoutesConfig = DefaultRoutesConfig;