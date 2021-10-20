import express from "express";
import {IndexRoutes} from './index.routes.config';
import {UsersRoutes} from './users.routes.config';
import {AuthRoutes} from './auth.routes.config';

import {DefaultController} from '../controllers/default.controller';
import {routeStore} from '../common/customTypes/types.config';
import {DefaultRoutesConfig} from './default.routes.config';

  export function initializeRoutes(app: express.Application):void{
    IndexRoutes(app);
    AuthRoutes(app);
    UsersRoutes(app);  
    new DefaultRoutesConfig(app,'/dishes',new DefaultController());
    new DefaultRoutesConfig(app,'/leaders',new DefaultController());
    new DefaultRoutesConfig(app,'/favorites',new DefaultController());
    new DefaultRoutesConfig(app,'/promotions',new DefaultController());

    for(let d in routeStore){
      if(routeStore[d])
      console.log('Added to routeStore :'+d)
    }
  } 
