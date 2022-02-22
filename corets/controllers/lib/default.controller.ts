import AssertionError from '../../common/customTypes/assertionError';
import express from 'express';
import { dbStore } from '../../common/customTypes/types.config';

export class DefaultController{
    db:any;
    public constructor(name:string){
      this.db = dbStore[name];
    }


    static async createInstance(svcName:string) {
      return await Promise.resolve(new DefaultController(svcName));
    }

 async list(req: express.Request, res: express.Response, next:express.NextFunction){
        let items =  await this.db.Tolist(20, 0);
        res.json({success:true, items:items})       
  }

  async  getById(req: express.Request, res: express.Response, next:express.NextFunction){
        let item = await this.db.getById(req.params.id);
        res.json({success:true,item:item})
    }

   async create (req: express.Request, res: express.Response, next:express.NextFunction){
        let item = await this.db.create(...req.body);
        console.log('document Created :', item);
        res.json({ success:true, id: item.id });
    }

  async  patch(req: express.Request, res: express.Response, next:express.NextFunction){
        await this.db.patchById(req.params.Id, ...req.body);
        this.sendJson({ "status": "OK" }, 204, res);
    }

   async put(req: express.Request, res: express.Response, next:express.NextFunction){
        await this.db.putById(req.params.Id, ...req.body);
        this.sendJson({ "status": "OK" }, 204, res);
  }
   async remove(req: express.Request, res: express.Response, next:express.NextFunction){
        await this.db.deleteById(req.params.id);
        this.sendJson({ "status": "OK" }, 204, res);
  }
  ////// helpers ================================
  async tryCatchRes(res: express.Response, funToFire:Function) {
    try {
      // fire only - res
       await funToFire()
    } catch (err:any) {
      if (err instanceof AssertionError) {
        console.error(err.stack)
        res.json({ success: false, error: err.message })
      } else {
        console.error(err.stack);
        res.json({ success: false, error: "operation faild error!!" })
      }
    }
  }
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

