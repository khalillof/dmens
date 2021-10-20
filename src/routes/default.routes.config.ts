import express from 'express';
import {corss, corsWithOptions} from './cors.config';
import {routeStore} from '../common/customTypes/types.config'
import UsersMiddleware from '../users/middleware/users.middleware';

export class DefaultRoutesConfig {
    app:express.Application;
    routename: string;
    controller:any;
    route_names: Array<string>;
    cors:any=corss;
    corsWithOption:any=corsWithOptions;

    constructor(exp: express.Application, rName: string, control:any, callback?:any) {
        this.app = exp;
        this.routename = rName; 
        this.controller = control;
        this.route_names = [this.routename, this.routename+'/:id'];
        typeof callback === 'function' ? callback(this): this.configureRoutes();
           
        // add instance to routeStore
        routeStore[this.routename]=this;

    }
     configureRoutes(): void{
        this.defaultRoutes();
     };

    getName(): string {
        return this.routename;
    }

    defaultRoutes(): void{  

        this.route_names.forEach((item)=> {
            this.app.route(item).options(this.corsWithOption, (req, res) => { res.sendStatus(200); } )
            .get( this.cors,this.cors,this.controller.ToList)
            .post(this.corsWithOption,UsersMiddleware.verifyUser, UsersMiddleware.verifyUserIsAdmin,this.controller.create)  
            .put(this.corsWithOption,UsersMiddleware.verifyUser, UsersMiddleware.verifyUserIsAdmin,this.controller.put)
            .patch(this.corsWithOption,UsersMiddleware.verifyUser, UsersMiddleware.verifyUserIsAdmin,this.controller.patch) 
            .delete(this.corsWithOption,UsersMiddleware.verifyUser, UsersMiddleware.verifyUserIsAdmin,this.controller.remove);
        });
            
        this.app.route(this.routename +'/id').get(this.corsWithOption,this.controller.getById);
    }     
     
}

