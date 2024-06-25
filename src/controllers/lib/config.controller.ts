import express from 'express';
import { DefaultController } from './default.controller.js';
import { envs } from '../../common/index.js'
import { Store} from '../../services/index.js'
import { IModelConfig, IModelConfigParameters } from '../../interfaces/index.js';
import { Operations } from '../../models/index.js';
import { IConfigController } from 'src/interfaces/lib/interfaces.js';

export class ConfigController extends DefaultController implements IConfigController {

    constructor(name = 'config') {
        super(name)
    }

    async routes(req: express.Request, res: express.Response, next: express.NextFunction) {
        let routes = Store.route.getRoutesPathMethods()
        this.responce(res).data(routes)
    }
    async deleteRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!req.query && !req.query['path'] && !(typeof req.query['path'] === 'string')) {
            return this.responce(res).badRequest('require query string path');
        }
        Store.route.deleteRoutePath(req.query['path'] as string)
        this.responce(res).success()
    }
    
    async viewsData(req: express.Request, res: express.Response, next: express.NextFunction) {
        let data = await Promise.resolve(Store.db.store.filter((f:any)=> f.config.dependent==false).map((a)=> a.config.getViewData!() ));
        //console.log(data)
        this.responce(res).data(data)
      }

    async forms(req: express.Request, res: express.Response, next: express.NextFunction) {
       let _forms =  await Promise.all(Store.db.store.map(async (d)=>  await d.config.genForm!()));
        this.responce(res).data(_forms)
      }
      
    override  async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        let conf: IModelConfigParameters = req.body;
        let result = await Operations.createModelConfigRoute(conf);

        envs.logLine('document created or Overrided :', result.controller?.db.name);
        this.responce(res).data(result.controller.db.config.getProps!())
    }


    override  async update(req: express.Request, res: express.Response, next: express.NextFunction) {
        let id = req.params['id'];

        let config = (id && await this.db.model?.findById(id)) || req.body.name && await this.db.model?.findOne({ name: req.body.name });

        let result = await Operations.overrideModelConfigRoute({ ...config, ...req.body });

        envs.logLine('document created or Overrided :', result.controller?.db.name);
        this.responce(res).success();
    }

    override  async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
        let id = req.params['id'];
        let item: IModelConfig | any = await this.db.model?.findById(id);

        if (item) {
            // delete config record on database
            await this.db.model?.findByIdAndDelete(id);
            // if there is db deleted
            Store.db.delete(item.name)

            // delete app route
            Store.route.deleteAppRoute(item.routeName)

            console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`)
            this.responce(res).success()

        } else {
            this.responce(res).notFound()
        }


    }
}