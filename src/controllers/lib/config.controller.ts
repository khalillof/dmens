import express from 'express';
import { DefaultController } from './default.controller.js';
import { Svc, envs } from '../../common/index.js'
import { IModelConfig, IModelConfigParameters } from '../../interfaces/index.js';
import { Operations } from '../../operations/index.js';
import { IConfigController } from 'src/interfaces/lib/interfaces.js';

export class ConfigController extends DefaultController implements IConfigController {

    constructor(name = 'config') {
        super(name)
    }

    async routes(req: express.Request, res: express.Response, next: express.NextFunction) {
        let routes = Svc.routes.getRoutesPathMethods()
        this.responce(res).data(routes)
    }
    async deleteRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!req.query && !req.query['path'] && !(typeof req.query['path'] === 'string')) {
            return this.responce(res).badRequest('require query string path');
        }
        Svc.routes.deleteRoutePath(req.query['path'] as string)
        this.responce(res).success()
    }
    
    async viewsData(req: express.Request, res: express.Response, next: express.NextFunction) {
        let data = await Promise.all(Svc.db.obj().filter((d)=>  d.config.dependent === false ).map((a)=> a.config.getViewData!() ));
        this.responce(res).data(data)
      }

    async forms(req: express.Request, res: express.Response, next: express.NextFunction) {
       let _forms =  await Promise.all(Svc.db.obj().map(async (d)=>  await d.config.genForm!()));
        this.responce(res).data(_forms)
      }
    override  async create(req: express.Request, res: express.Response) {
        let conf: IModelConfigParameters = req.body;
        let result = await Operations.createModelConfigRoute(conf);

        envs.logLine('document created or Overrided :', result.controller?.db.name);
        this.responce(res).data(result.controller.db.config.getProps!())
    }


    override  async update(req: express.Request, res: express.Response, next: express.NextFunction) {
        let id = req.params['id'];

        let config = (id && await this.db.findById(id)) || req.body.name && await this.db.findOne({ name: req.body.name });

        let result = await Operations.overrideModelConfigRoute({ ...config, ...req.body });

        envs.logLine('document created or Overrided :', result.controller?.db.name);
        this.responce(res).success();
    }

    override  async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
        let id = req.params['id'];
        let item: IModelConfig = await this.db.findById(id);

        if (item) {
            // delete config record on database
            await this.db.deleteById(id);
            // if there is db deleted
            Svc.db.delete(item.name)

            // delete app route
            Svc.routes.deleteAppRoute(item.routeName)

            console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`)
            this.responce(res).success()

        } else {
            this.responce(res).notFound()
        }


    }
}