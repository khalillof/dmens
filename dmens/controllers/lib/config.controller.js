import { DefaultController } from './default.controller.js';
import { Svc, envConfig } from '../../common/index.js';
import { Operations } from '../../operations/index.js';
export class ConfigController extends DefaultController {
    constructor(name = 'config') {
        super(name);
    }
    async routes(req, res, next) {
        let routes = Svc.routes.getRoutesPathMethods();
        this.responce(res).data(routes);
    }
    async post(req, res) {
        let conf = req.body;
        let result = await Operations.createModelConfigRoute(conf);
        envConfig.logLine('document created or Overrided :', result.controller?.db.name);
        this.responce(res).data(result.configProp.getConfigProps());
    }
    async put(req, res, next) {
        let id = req.params['id'];
        let config = (id && await this.db.findById(id)) || req.body.name && await this.db.findOne({ name: req.body.name });
        let result = await Operations.overrideModelConfigRoute({ ...config, ...req.body });
        envConfig.logLine('document created or Overrided :', result.controller?.db.name);
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
            // delete route
            Svc.routes.delete(item.routeName);
            console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`);
            this.responce(res).success();
        }
        else {
            this.responce(res).notFound();
        }
    }
}
