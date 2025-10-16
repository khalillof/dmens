import { Request, Response, NextFunction } from 'express';
import { DefaultController } from './default.controller.js';
import { appData, responces, IConfigration, IConfigParameters, IConfigController, IMethod, appMethods, appActions } from '../../common/index.js';
import { createMangedInstance, createRouteInstance, getMetaData } from '../../models/index.js';
import mongoose from 'mongoose';

// https://mongoosejs.com/docs/typescript/statics-and-methods.html
export class ConfigController extends DefaultController implements IConfigController {

    constructor(config: IConfigration) {
        super(config)

    }

    async routes(req: Request, res: Response, next: NextFunction) {

        let modelName = req.params['modelName'];

        if (modelName) {
            let routes = appData.get(modelName)?.activeRoutes!;
            return responces.data(res, routes)
        }
        return responces.notFound(res)
    }

    async metadata(req: Request, res: Response, next: NextFunction) {
        let modelName = req.params['modelName'];
      
        if(modelName === 'config'){
          let items = await this.db.getMetaData!();
          return responces.data(res, items)
        }else if(modelName && appData.has(modelName)){
         let items   = await appData.get(modelName)?.controller.db.getMetaData();
        return responces.data(res, items)
        }else{
            return responces.notFound(res);
        }
    }

    // /configs/model/:name/viewData
    async viewdata(req: Request, res: Response, next: NextFunction) {
        let name = req.params['modelName'];

        if (name && name !== 'config') {
            let view_data : any = (await this.db.findOne({ name }))?.getViewData();
             view_data['metaData']  = await appData.get(name)?.controller.db.getMetaData();

            return responces.data(res, view_data);
        }else if(name && name === 'config'){
            
            return responces.badRequest(res);
        }

        return responces.notFound(res);
    }
     // /http://localhost:8000/api/configs/data/viewsdata?isArchieved=false&limit=6
    //http://localhost:8000/api/configs/data/viewsdata?isArchieved=false&tags=tuban&limit=2
    async viewsdata(req: Request, res: Response, next: NextFunction) {
        let query = this.buildQuery!(req.query === null ? { isArchieved: false } : req.query);
          
        let items = await this.db.toList(query);
        let result = await Promise.all(items.map(async item =>  await item.getViewData()));
        //console.log(data)
        return responces.data(res, result)
    }
    async getRoutesPathMethods(req: Request, res: Response, next: NextFunction) {
        let name = req.params['modelName'];
        let routeConfig = appData.get(name);
        if (name && routeConfig) {
            let vd = routeConfig.routeManager.getRoutesPathMethods()
            return responces.data(res, vd);
        }

        return responces.notFound(res);
    }
    async addRoute(req: Request, res: Response, next: NextFunction) {
        const name = req.params['modelName'];
        const { path, method, action } = {...req.query,...req.body} as any;

        if (!(name)) {
            return responces.notFound(res);
        }

        if ((typeof path === 'string' && typeof method === 'string') && appMethods.isFound(method)) {

            let routeConfig: any = appData.get(name);
            if (routeConfig.activeRoutes[method].isFound(path)) {
                return responces.error(res, new Error(`path - ${path} - already on active Routes list`));
            }

            if(!appActions.isFound(action)){
                return responces.error(res, new Error(`action name - ${action} - is not valid action name`));
                
            }
            else if(routeConfig.config.disabledActions.isFound(action)){
                return responces.error(res, new Error(`action name - ${action} - is action name : ${action} is on disabledAction list`));
                
            }
            else{
                await routeConfig.addRoute(method, path, action);
                return responces.success(res)
            }

        } else {

            return  responces.badRequest(res);
        }
    }

    async removeRoute(req: Request, res: Response, next: NextFunction) {
        let name = req.params['modelName'];
        let { path, method, action } = {...req.query,...req.body} as any;

        if (!(name)) {
            return responces.notFound(res);
        }

        if ((typeof path === 'string' && typeof method === 'string') && appMethods.isFound(method)) {

            let routeConfig: any = appData.get(name);
            if (!routeConfig.activeRoutes[method].isFound(path)) {
                return responces.notFound(res);
            } else {
                routeConfig?.routeManager.deleteRoutePath(path as string, method as IMethod);
                routeConfig.activeRoutes.get.deleteItemInArray(path);

                routeConfig.config.disabledActions.deleteItemInArray(action);
                routeConfig.controller.config = routeConfig.config;
                
                 await  this.db.findById(routeConfig.config._id)
                return responces.success(res)
            }
        } else {
            return responces.badRequest(res);
        }
    }

    async enableRoutes(req: Request, res: Response, next: NextFunction) {
        let name = req.params['modelName'];

        if (!(name)) {
            return responces.notFound(res);
        }

        if(appData.has(name)){
           await  appData.get(name)?.defaultRoutes();
           return responces.success(res)
        }else{
            let config = await this.db.findOne({name});
           await createRouteInstance(config as IConfigration);
           return responces.success(res);
        }

       
    }

    async disableRoutes(req: Request, res: Response, next: NextFunction) {
        let name = req.params['modelName'];

        if (!(name)) {
            return responces.notFound(res);
        }
        
        if(appData.has(name)){
            appData.get(name)?.routeManager.removeAllRoutes();
            // remove route instance
            appData.delete(name);
         }
         return responces.success(res)
    }

    // http://localhost:8000/api/configs/routesdata?archieve=false&tags=tuban

    override  async create(req: Request, res: Response, next: NextFunction) {
        let conf: IConfigParameters = req.body;
        // let result = await Operations.createModelConfigRoute(conf);
      await  createMangedInstance(conf)
        // envs.logLine('document created or Overrided :', result.controller?.db.name);
        // this.responce(res).data(result.controller.db.config.getProps!())
        responces.success(res);

    }

    override  async update(req: Request, res: Response, next: NextFunction) {
        let _id = req.params[this.config.paramId!];
        let exist:IConfigration = await this.db.exists({_id}) as any;
        if(_id && exist ){
            
            let updatedConfig :IConfigration | null=   await this.db.findByIdAndUpdate(_id,req.body);

            if(!updatedConfig?.isArchieved && !updatedConfig?.disableRoutes){
                if(appData.has(exist.name)){
                    appData.get(updatedConfig!.name)?.routeManager.removeAllRoutes();
                    appData.delete(exist.name)
                }
                await   createMangedInstance(updatedConfig!,true);
            }
        
        return responces.data(res,updatedConfig);
        }
        
        // let result = await Operations.overrideModelConfigRoute({ ...config, ...req.body });
        //envs.logLine('document created or Overrided :', result.controller?.db.name);
       return responces.notFound(res);
    }

    override  async delete(req: any, res: Response, next: NextFunction) {
        let _id = req.params[this.config.paramId!];
        let exist:IConfigration = await this.db.exists({_id}) as any;
        if(_id && exist ){
            let data :IConfigration | null=   await this.db.findOneAndDelete({_id});

            if(!data?.isArchieved && !data?.disableRoutes){
                if(appData.has(exist.name)){
                    appData.get(data!.name)?.routeManager.removeAllRoutes();
                    appData.delete(exist.name);
                }
                if(mongoose.models[data!.name]){
                   mongoose.deleteModel(data!.name);
                }
            }
        console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${data}`)
         responces.data(res,data);
        }
         responces.notFound(res)
    }
}