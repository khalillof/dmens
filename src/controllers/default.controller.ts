import express from 'express';
import {IController} from './Icontroller.controller'
import {getSvc} from '../common/customTypes/types.config'
import {returnJson} from '../common/customTypes/types.config'
import { ISvc } from 'src/services/ISvc.services';
//import { Svc } from 'src/services/Svc.services';
export class DefaultController implements IController {
    svc:ISvc;
    public constructor(svs:ISvc){
    this.svc = svs;
    }
    public static async createInstance(svcName:string){
        var result = new DefaultController(getSvc(svcName));
      return  await Promise.resolve(result);
    }
    async  ToList(req: express.Request, res: express.Response, next:express.NextFunction) {
           //await getSvc(req.url).Tolist(100, 0)
           this.svc.Tolist(100, 0)
           .then((items) => returnJson(items,200, res), (err) => next(err))
          .catch((err) => next(err));       
    }

    async getById(req: express.Request, res: express.Response, next:express.NextFunction) {
       // await getSvc(req.url)
        this.svc.getById(req.params.id)
        .then((item) => returnJson(item,200, res), (err) => next(err))
        .catch((err) => next(err));
        
    }

    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        // await getSvc(req.url)
         this.svc.create(req.body).then((item) => {
            console.log('document Created :', item);
            returnJson({id: item.id},201, res)
          }, (err) => next(err))
          .catch((err) => next(err));
    }

    async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
       // await getSvc(req.url)
        this.svc.patchById(req.body)
        .then(() => returnJson({"status":"OK"}, 204,res), (err) => next(err))
        .catch((err) => next(err));
        
    }

    async put(req: express.Request, res: express.Response, next:express.NextFunction) {
       // await getSvc(req.url)
        this.svc.putById({_id: req.params.Id, ...req.body})
        .then(() =>  returnJson({"status":"OK"}, 204,res), (err) => next(err))
          .catch((err) => next(err));
    }

    async remove(req: express.Request, res: express.Response, next:express.NextFunction) {
        //await getSvc(req.url)
        this.svc.deleteById(req.params.id)
        .then(() => returnJson({"status":"OK"}, 204,res), (err) => next(err))
          .catch((err) => next(err));
    }

    ////// helpers
    async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }

}

