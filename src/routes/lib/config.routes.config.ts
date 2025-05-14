
import { NextFunction, Response, Request } from 'express';
import { appData, IDefaultRoutesConfig } from '../../common';
import mongoose from 'mongoose';

export async function ConfigRoutesCallback(this: IDefaultRoutesConfig) {
    await this.defaultRoutes();

    // ------ /configs/:name/viewData
    for await (let action of ['metadata', 'routes', 'viewdata', 'routedata']) {
        await this.addRoute('get', ':modelName/' + action, action);
    }

     await this.addRoute('get',':modelName/routes/details', 'getRoutesPathMethods');
    await this.addRoute('post', ':modelName/routes', 'addRoute');
    await this.addRoute('delete', ':modelName/routes', 'removeRoute');
    
    await this.addRoute('post', ':modelName/routes/defult', 'enableRoutes');
    await this.addRoute('delete', ':modelName/routes/default', 'disableRoutes');
    ["viewsdata", "routesdata"].forEach(async (action) => await this.addRoute('get', 'data/'+action, action));

    this.router.param("modelName", (req: Request, res: Response, next: NextFunction, name: string) => {
        if(mongoose.models[name]){
         next()
         }else{
          next(new Error('error - model name NOT FOUND :' + name));
         }
    });
}
