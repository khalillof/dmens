import express from 'express';
import {IController} from './Icontroller.controller'
import {getDb} from '../common/customTypes/types.config'
import {returnJson} from '../common/customTypes/types.config'
import { ISvc } from '../services/ISvc.services';
export class DefaultController implements IController {
    svc:ISvc | any;
    public constructor(name:string){
    this.setDb(name);
    }

    setDb(url:string){
      this.svc = getDb(url);
      
  }
    public static async createInstance(svcName:string){
      var result = new DefaultController(svcName);
      if (!result.svc){
          result.setDb(svcName);
      }
      return  await Promise.resolve(result);
    }
    async  ToList(req: express.Request, res: express.Response, next:express.NextFunction) {
          await getDb(req.url).Tolist(100, 0)
           .then((items) => returnJson(items,200, res), (err) => next(err))
           .catch((err) => next(err));       
    }

    async getById(req: express.Request, res: express.Response, next:express.NextFunction) {

       await getDb(req.url).getById(req.params.id)
        .then((item) => returnJson(item,200, res), (err) => next(err))
        .catch((err) => next(err));
        
    }

    async create(req: express.Request, res: express.Response, next: express.NextFunction) {

      await  getDb(req.url).create(req.body).then((item) => {
            console.log('document Created :', item);
            returnJson({id: item.id},201, res)
          }, (err) => next(err))
          .catch((err) => next(err));
    }

    async patch(req: express.Request, res: express.Response, next: express.NextFunction) {

      await getDb(req.url).patchById(req.body)
        .then(() => returnJson({"status":"OK"}, 204,res), (err) => next(err))
        .catch((err) => next(err));
        
    }

    async put(req: express.Request, res: express.Response, next:express.NextFunction) {
      await getDb(req.url).putById({_id: req.params.Id, ...req.body})
        .then(() =>  returnJson({"status":"OK"}, 204,res), (err) => next(err))
          .catch((err) => next(err));
    }

    async remove(req: express.Request, res: express.Response, next:express.NextFunction) {
       await getDb(req.url).deleteById(req.params.id)
        .then(() => returnJson({"status":"OK"}, 204,res), (err) => next(err))
          .catch((err) => next(err));
    }

    ////// helpers
    async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }

}

