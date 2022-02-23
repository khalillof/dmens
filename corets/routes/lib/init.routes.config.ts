"use strict";
import {appRouter} from '../../common/customTypes/types.config';

const path = require('path');


export function IndexRoutes() {
  let index = {
    '/':'../../public/coming_soon/index.html',
    '/angular':'../../public/angular/index.html',
    'reactjs':'../../public/reactjs/index.html'
  }

  for (const [key, value] of Object.entries(index)) {
    appRouter.get(key, (req:any, res:any, next:any) => res.status(200).sendFile(path.join(__dirname, value)));
  }
}
/*
export async function initCustomRoutes(callback?:Function){
    // index routes
    IndexRoutes();
    await DefaultRoutesConfig.createInstancesWithDefault().then(async ()=>{
    await UsersRoutes().then(async () => {
        await AuthRoutes().then(async ()=>{
          await SchemaRoutes()
            if (typeof callback === 'function') {
                callback()
            }
            // print routes 
            printRoutesToString()
        });
    });
  });
}
*/