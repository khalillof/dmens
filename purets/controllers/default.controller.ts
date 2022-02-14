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
      return async (req: express.Request, res: express.Response, next:express.NextFunction)=> {
        let items =  await self.db.Tolist(20, 0);
        res.json({success:true, items:items})       
    }
  }

    getById(self:any) {
      return async(req: express.Request, res: express.Response, next:express.NextFunction)=> {
        let item = await self.db.getById(req.params.id);
        res.json({success:true,item:item})
      }
    }

    create (self:any) {
      return async (req: express.Request, res: express.Response, next:express.NextFunction)=>{
        let item = await self.db.create(...req.body);
        console.log('document Created :', item);
        res.json({ success:true, id: item.id });
    }}

    patch(self:any) {
      return async(req: express.Request, res: express.Response, next:express.NextFunction)=> {
        await self.db.patchById(req.params.Id, ...req.body);
        self.sendJson({ "status": "OK" }, 204, res);
      }
    }

    put(self:any) {
      return async(req: express.Request, res: express.Response, next:express.NextFunction)=> {
        await self.putById(req.params.Id, ...req.body);
        self.sendJson({ "status": "OK" }, 204, res);
    }
  }
    remove(self:any) {
      return async(req: express.Request, res: express.Response, next:express.NextFunction)=> {
        await self.db.deleteById(req.params.id);
        self.sendJson({ "status": "OK" }, 204, res);
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
  

    resultCb ={
      res:(res:express.Response,next: express.NextFunction, callback?:any)=>{
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

