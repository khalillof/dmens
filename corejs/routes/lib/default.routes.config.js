"use strict";
const { corsWithOptions } = require('./cors.config');
const { routeStore, appRouter, dbStore, pluralizeRoute } = require('../../common/customTypes/types.config');
const { DefaultController } = require('../../controllers/');
const { UsersMiddleware } = require('../../users/middleware/users.middleware');
const {Assert} = require('../../common/customTypes/assert');
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
      this.UsersMWare = new UsersMiddleware();
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

  static async createInstancesWithDefault() {
    Object.keys(dbStore).forEach(async name => name !== 'user' ? await DefaultRoutesConfig.instance(name, await DefaultController.createInstance(name)) : false)
  }

  custumMiddleWare(rName) {
    if (rName) {
      this.routeName = rName;
      this.routeParam = this.routeName + '/:id';
    }
    return {
      getList: (...callback) => this.router.get(this.routeName,this.corsWithOption,...callback, this.actions('list')),
      getId: (...callback) => this.router.get(this.routeParam,this.corsWithOption, ...callback, this.actions('getById')),
      post: (...callback) => this.router.post(this.routeName,this.corsWithOption, ...callback, this.actions('create')),
      put: (...callback) => this.router.put(this.routeParam, this.corsWithOption,...callback, this.actions('put')),
      delete: (...callback) => this.router.delete(this.routeParam,this.corsWithOption, ...callback, this.actions('remove'))
    }
  }
  configureRoutes() {
    this.router.all(this.routeName,this.corsWithOption);
    this.router.get(this.routeName, this.actions('list'))
    this.router.get(this.routeParam, this.actions('getById'))
    this.router.post(this.routeName, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.actions('create'))
    this.router.put(this.routeParam, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.actions('put'))
    this.router.delete(this.routeParam, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.actions('remove'));
    this.router.param('id', async (req,res,next, id)=>{ Assert.idString(id); next()});
    

  }

  actions(name) {
      return async (req, res, next) => {
      return await this.controller[name](req, res, next);
    }
  }

}



exports.DefaultRoutesConfig = DefaultRoutesConfig;