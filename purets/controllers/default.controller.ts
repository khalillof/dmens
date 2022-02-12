import express from 'express';
const { dbStore } = require('../common/customTypes/types.config');

export class DefaultController{
    db:any;
    public constructor(name:string){
      this.db = dbStore[name];
    }


    static async createInstance(svcName:string) {
      return await Promise.resolve(new DefaultController(svcName));
    }

  ToList(self:any) {
      return(req: express.Request, res: express.Response, next:express.NextFunction)=> {
          self.db.Tolist(100, 0)
           .then((items:any) => self.sendJson(items,200, res), (err:any) => next(err))
           .catch((err:any) => next(err));       
    }
  }

    getById(self:any) {
      return(req: express.Request, res: express.Response, next:express.NextFunction)=> {
       self.db.getById(req.params.id)
        .then((item:any) => self.sendJson(item,200, res), (err:any) => next(err))
        .catch((err:any) => next(err));
      }
    }

    create (self:any) {
      return(req: express.Request, res: express.Response, next:express.NextFunction)=>{

      self.db.create(...req.body).then((item:any) => {
            console.log('document Created :', item);
            self.sendJson({id: item.id},201, res)
          }, (err:any) => next(err))
          .catch((err:any) => next(err));
    }}

    patch(self:any) {
      return(req: express.Request, res: express.Response, next:express.NextFunction)=> {

      self.db.patchById(req.params.Id, ...req.body)
        .then(() => self.sendJson({"status":"OK"}, 204,res), (err:any) => next(err))
        .catch((err:any) => next(err));
      }
    }

    put(self:any) {
      return(req: express.Request, res: express.Response, next:express.NextFunction)=> {
      self.db.putById(req.params.Id, ...req.body)
        .then(() =>  self.sendJson({"status":"OK"}, 204,res), (err:any) => next(err))
          .catch((err:any) => next(err));
    }
  }
    remove(self:any) {
      return(req: express.Request, res: express.Response, next:express.NextFunction)=> {
       self.db.deleteById(req.params.id)
        .then(() => self.sendJson({"status":"OK"}, 204,res), (err:any) => next(err))
          .catch((err:any) => next(err));
    }
  }
    ////// helpers
    extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }
    sendJson(obj:any, status:any, res:express.Response) {
      res.setHeader('Content-Type', 'application/json');
      res.status(status).json(obj);
    }
  
    First(obj:any, self:any) {
      return self.db.findOne(obj);
    }

    resultCb ={
      res:(res:express.Response, callback?:any)=>{
         return {
           cb:(err:any, obj:any, info:any)=> {
              if (err)
                res.json({ success: false, message: 'operation Unsuccessful!', err: info || err })
              else if (obj) {
                typeof callback ==='function' ? callback(obj) : res.json({ success: true, message: 'operation Successful!' })
              }
              else if(!err && !obj) {
                res.json({ success: false, message: 'operation Unsuccessful!', err: info || err || 'error' })
              }   
            }    
         }
    }}


}

