
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { getDb,dbStore, returnJson} =require('../common/customTypes/types.config');

class DefaultController {
  svc;
 constructor(name){
    this.svc = getDb(name);
    }

  setDb(name){
    this.svc = getDb(name);
    }
    
    static async createInstance(svcName){
        var result = new DefaultController(svcName);
        if (!result.svc){
            result.setDb(svcName);
        }
      return  await Promise.resolve(result);
    }
    async  ToList(req, res, next) {
         await getDb(req.url).Tolist(20, 0)
           .then((items) => returnJson(items,200, res), (err) => next(err))
          .catch((err) => next(err));       
    }

    async getById(req, res, next) {
       // await getSvc(req.url)
      await getDb(req.url).getById(req.params.id)
        .then((item) => returnJson(item,200, res), (err) => next(err))
        .catch((err) => next(err));
        
    }

    async create(req, res, next) {

        await getDb(req.url).create(req.body).then((item) => {
            console.log('document Created :', item);
            returnJson({id: item.id},201, res)
          }, (err) => next(err))
          .catch((err) => next(err));
    }

    async patch(req, res, next) {
      await getDb(req.url).patchById(req.body)
        .then(() => returnJson({"status":"OK"}, 204,res), (err) => next(err))
        .catch((err) => next(err));
        
    }

    async put(req, res, next) {
      await getDb(req.url).putById({_id: req.params.Id, ...req.body})
        .then(() =>  returnJson({"status":"OK"}, 204,res), (err) => next(err))
          .catch((err) => next(err));
    }

    async remove(req, res, next) {
      await getDb(req.url).deleteById(req.params.id)
        .then(() => returnJson({"status":"OK"}, 204,res), (err) => next(err))
          .catch((err) => next(err));
    }

    ////// helpers
    async extractId(req, res, next) {
        req.body.id = req.params.id;
        next();
    }

}

exports.DefaultController = DefaultController;
