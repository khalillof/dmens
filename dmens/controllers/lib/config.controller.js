import { DefaultController } from './default.controller.js';
import { envConfig } from '../../common/index.js';
import { Configration } from '../../operations/index.js';
export class ConfigController extends DefaultController {
    constructor(name = 'config') {
        super(name);
    }
    async post(req, res) {
        let conf = req.body;
        let result = await Configration.createOverrideModelConfigRoute(conf);
        envConfig.logLine('document created or Overrided :', result.name);
        this.responce(res).success();
    }
    async put(req, res, next) {
        this.post(req, res);
    }
}
