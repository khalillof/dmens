"use strict";
import {printRoutesToString, appRouter} from '../../common/customTypes/types.config';
import { AuthRoutes } from './auth.routes.config';
import { UsersRoutes } from './users.routes.config';
const path = require('path');
import { DefaultRoutesConfig} from './default.routes.config';

function IndexRoutes() {
  let index = {
    '/':'../../public/coming_soon/index.html',
    '/angular':'../../public/angular/index.html',
    'reactjs':'../../public/reactjs/index.html'
  }

  for (const [key, value] of Object.entries(index)) {
    appRouter.get(key, (req:any, res:any, next:any) => res.status(200).sendFile(path.join(__dirname, value)));
  }
}
export async function initCustomRoutes(callback?:any){
    // index routes
    IndexRoutes();
    await DefaultRoutesConfig.createInstancesWithDefault().then(async ()=>{
    await UsersRoutes().then(async () => {
        await AuthRoutes().then(()=>{
            if (typeof callback === 'function') {
                callback()
            }
            // print routes 
            printRoutesToString()
        });
    });
  });
}