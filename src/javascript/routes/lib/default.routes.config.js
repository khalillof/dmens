"use strict";
const { corsWithOptions } = require('./cors.config');
const { routeStore, dbStore, pluralizeRoute, Assert} = require('../../common');
const { authenticateUser} = require('../../services');
const {DefaultController} = require('../../controllers');
const {Middlewares} = require('../../middlewares');
 

async function getMware(){
  let item= Object.values(routeStore).find(r=>  r.UsersMWare instanceof UsersMiddleware );
  let result = item ? item.mware : await Middlewares.createInstance();
return await Promise.resolve(result);
}
class DefaultRoutesConfig {

  constructor(exps, rName,controller=null,mWare=null,callback=null) {
    this.app = exps;
    this.routeName = pluralizeRoute(rName);
    this.routeParam = this.routeName + '/:id';
    this.corsWithOption = corsWithOptions;
    this.controller = controller;
    this.mware = mWare;
    this.authenticate = authenticateUser;
    typeof callback === 'function' ? callback.call(this) : this.defaultRoutes();
    // add instance to routeStore
    routeStore[this.routeName] = this;

    console.log('Added ( ' + this.routeName + ' ) to routeStore');
  }

  static async instance(exps,rName, control, callback) {
    let umwre = control ? await getMware(): null;
    let result =  new DefaultRoutesConfig(exps,rName,control,umwre,callback);
    return await Promise.resolve(result);
  }

  buildMdWares(middlewares, useMwar=true){
    let mdwares = [this.corsWithOption];
    if(useMwar)
      mdwares = [...mdwares,this.authenticate("jwt")];
    if(middlewares)
      mdwares.concat(middlewares);
    return mdwares;
  }

  static async createInstancesWithDefault(exps){
  return  await Promise.resolve(Object.keys(dbStore).forEach(async name =>  {if ('account editor'.indexOf(name) === -1) await DefaultRoutesConfig.instance(exps,name,await DefaultController.createInstance(name))}))
 }
  // custom routes
  getList(middlewares, useMwar=true){
   return this.app.get(this.routeName, ...this.buildMdWares(middlewares,useMwar), this.actions('list'))
  }
  getId(middlewares, useMwar=true){
   return this.app.get(this.routeParam, ...this.buildMdWares(middlewares,useMwar),this.actions('findById'))
  }
  post(middlewares, useMwar=true){
   return this.app.post(this.routeName, ...this.buildMdWares(middlewares,useMwar),this.actions('create'))
  }
  put(middlewares, useMwar=true){
   return this.app.put(this.routeParam, ...this.buildMdWares(middlewares,useMwar),this.actions('put'))
  }
  delete(middlewares, useMwar=true){  
    middlewares=  middlewares ?? [this.mware.validateSameEmailBelongToSameUser]
   return this.app.delete(this.routeParam, ...this.buildMdWares(middlewares,useMwar),this.actions('remove'))
  }
  param(){
    return this.app.param('id', async (req,res,next, id)=>{ 
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
 
  actions(actionName){ 
    return this.controller.tryCatchActions(actionName);
}

}


module.exports = {DefaultRoutesConfig,getMware};