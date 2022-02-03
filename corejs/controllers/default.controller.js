
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const {getSvc} =require('../common/customTypes/types.config');
const {returnJson} =require('../common/customTypes/types.config');

class DefaultController {
   
 constructor(sv){
    this.svc = sv;
    }
    static async createInstance(svcName){
      let sv = getSvc(svcName)
        var result = new DefaultController(sv);

      return  await Promise.resolve(result);
    }
    async  ToList(req, res, next) {
           //await getSvc(req.url).Tolist(100, 0)
           if(!this.svc){
           res.sendStatus(200); 
           }else{
            res.sendStatus(404);
           }
          // this.svc.Tolist(100, 0)
           //.then((items) => returnJson(items,200, res), (err) => next(err))
          //.catch((err) => next(err));       
    }

    async getById(req, res, next) {
       // await getSvc(req.url)
        this.svc.getById(req.params.id)
        .then((item) => returnJson(item,200, res), (err) => next(err))
        .catch((err) => next(err));
        
    }

    async create(req, res, next) {
        // await getSvc(req.url)
         this.svc.create(req.body).then((item) => {
            console.log('document Created :', item);
            returnJson({id: item.id},201, res)
          }, (err) => next(err))
          .catch((err) => next(err));
    }

    async patch(req, res, next) {
       // await getSvc(req.url)
        this.svc.patchById(req.body)
        .then(() => returnJson({"status":"OK"}, 204,res), (err) => next(err))
        .catch((err) => next(err));
        
    }

    async put(req, res, next) {
       // await getSvc(req.url)
        this.svc.putById({_id: req.params.Id, ...req.body})
        .then(() =>  returnJson({"status":"OK"}, 204,res), (err) => next(err))
          .catch((err) => next(err));
    }

    async remove(req, res, next) {
        //await getSvc(req.url)
        this.svc.deleteById(req.params.id)
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
