import express from 'express';
import { DefaultController } from './default.controller.js';
import { envConfig } from '../../common/index.js'
import { IConfigPropsParameters } from '../../interfaces/index.js';
import { Configration } from '../../operations/index.js';

export class ConfigController extends DefaultController {

    constructor(name = 'config') {
        super(name)
    }


    override  async post(req: express.Request, res: express.Response) {
        let conf: IConfigPropsParameters = req.body;
        let result = await Configration.createOverrideModelConfigRoute(conf);

        envConfig.logLine('document created or Overrided :', result.name);
        this.responce(res).success();
    }


    override  async put(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.post(req,res)
    }
}