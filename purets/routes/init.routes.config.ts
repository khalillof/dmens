import express from "express";
import {IndexRoutes} from './index.routes.config';
import {UsersRoutes} from './users.routes.config';
import {AuthRoutes} from './auth.routes.config';

import {DefaultRoutesConfig} from './default.routes.config';

  export async function initializeRoutes(app: express.Application){
 
   await DefaultRoutesConfig.createInstancesWithDefault(app,['/dishes', '/leaders', '/favorites', '/promotions']);
   await IndexRoutes(app);
   await AuthRoutes(app);
   await UsersRoutes(app);  

  return await Promise.resolve(availableRoutesToString(app))
  } 

  // helpers
  function availableRoutesToString(app:express.Application) {
    let result = app._router.stack
      .filter((r:any) => r.route)
      .map((r:any) => Object.keys(r.route.methods)[0].toUpperCase().padEnd(7) + r.route.path)
      .join("\n");
      
      console.log('================= All Routes avaliable ================ \n'+ result)
  }
  function availableRoutesToJson(app:express.Application) {
    let result = app._router.stack
        .filter((r:any) => r.route)
        .map((r:any) => {
        return {
            method: Object.keys(r.route.methods)[0].toUpperCase(),
            path: r.route.path
        };
    });
    console.log('================= All Routes avaliable ================ \n'+ JSON.stringify(result, null, 2))
    //console.log(JSON.stringify(result, null, 2));
  }
