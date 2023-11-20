import { DefaultController } from './default.controller.js';
import { Svc, envs } from '../../common/index.js';
import { Operations } from '../../operations/index.js';
export class ConfigController extends DefaultController {
    constructor(name = 'config') {
        super(name);
    }
    async routes(req, res, next) {
        let routes = Svc.routes.getRoutesPathMethods();
        this.responce(res).data(routes);
    }
    async deleteRoute(req, res, next) {
        if (!req.query && !req.query['path'] && !(typeof req.query['path'] === 'string')) {
            return this.responce(res).badRequest('require query string path');
        }
        Svc.routes.deleteRoutePath(req.query['path']);
        this.responce(res).success();
    }
    async modelsdata(req, res, next) {
        let data = await Promise.all(Svc.db.obj().map(async (d) => d.config.modelData));
        this.responce(res).data(data);
    }
    async forms(req, res, next) {
        let _forms = await Promise.all(Svc.db.obj().map(async (d) => await d.config.genForm()));
        this.responce(res).data(_forms);
    }
    async create(req, res) {
        let conf = req.body;
        let result = await Operations.createModelConfigRoute(conf);
        envs.logLine('document created or Overrided :', result.controller?.db.name);
        this.responce(res).data(result.controller.db.config.getProps());
    }
    async update(req, res, next) {
        let id = req.params['id'];
        let config = (id && await this.db.findById(id)) || req.body.name && await this.db.findOne({ name: req.body.name });
        let result = await Operations.overrideModelConfigRoute({ ...config, ...req.body });
        envs.logLine('document created or Overrided :', result.controller?.db.name);
        this.responce(res).success();
    }
    async delete(req, res, next) {
        let id = req.params['id'];
        let item = await this.db.findById(id);
        if (item) {
            // delete config record on database
            await this.db.deleteById(id);
            // if there is db deleted
            Svc.db.delete(item.name);
            // delete app route
            Svc.routes.deleteAppRoute(item.modelData.routeName);
            console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`);
            this.responce(res).success();
        }
        else {
            this.responce(res).notFound();
        }
    }
}
