"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const {corss, corsWithOptions} = require('./cors.config');
const {routeStore} = require('../common/customTypes/types.config');
const {UsersMiddleware} = require('../users/middleware/users.middleware');
const { DefaultController } = require('../controllers/default.controller');

class DefaultRoutesConfig {
    constructor(exp, rName, control, callback) {
        this.app = exp;
        this.routeName = rName;
        this.routeParam = this.routeName + '/:id';
        this.cors = corss;
        this.corsWithOption = corsWithOptions;
        this.UsersMWare = new UsersMiddleware();
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
    static async createInstancesWithDefault(exp, routeNames){
        if(routeNames && routeNames?.length > 0){
          routeNames.forEach(async name => await  DefaultRoutesConfig.instance(exp, name, await DefaultController.createInstance(name)) )
        }else{
            throw new Error('at least one route name expected')
        }
    }
    getName(){
        return this.routeName;
    }

    configureRoutes(){  
   
 
            //this.app.route(item).options(this.corsWithOption, (req, res) => { res.sendStatus(200); } )
        //this.app.route(item)
           this.app.get(this.routeName,this.cors,this.controller.ToList)
           this.app.get(this.routeParam,this.cors,this.controller.getById)
           this.app.post(this.routeName,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.create)  
           this.app.put(this.routeName,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.put)
           this.app.patch(this.routeName,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.patch) 
           this.app.delete(this.routeParam,this.corsWithOption,this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin,this.controller.remove);

            
        //this.app.route(this.routename +'/id').get(this.corsWithOption,this.controller.getById);
    }     
     
}

exports.DefaultRoutesConfig = DefaultRoutesConfig;