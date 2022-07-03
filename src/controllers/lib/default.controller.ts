import express from 'express';
import { dbStore,logger, responce} from '../../common/index.js';
import{Ilogger,Iresponce,IController, IJsonModel} from '../../interfaces/index.js';

export class DefaultController implements IController {
  db: IJsonModel;
  responce:Iresponce;
  log:Ilogger;
  constructor(name: string) {
    this.db = dbStore[name];
    this.responce = responce;
    this.log = logger;
  }

 public static async createInstance(svcName: string){
    return new this(svcName);
  }
  
  async list(req: express.Request, res: express.Response, next: express.NextFunction) {
    let items = await this.db.Tolist(20, 0, req.query);
    this.responce(res).data(items)

  }

  async findById(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = await this.db.findById(req.params['id']);
    this.responce(res).data(item)
  }
  async findOne(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = await this.db.findOne(req.query);
    this.responce(res).data(item)
  }
  async create(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = await this.db.create(req.body);
    console.log('document Created :', item);
    this.responce(res).data(item)
  }

  async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.db.patchById(req.params['id'], req.body);
    this.responce(res).success()
  }

  async put(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.db.putById(req.params['id'],req.body);
    this.responce(res).success()
  }
  async remove(req: express.Request, res: express.Response, next: express.NextFunction) {
   let item = await this.db.deleteById(req.params['id']);
   console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`)
    this.responce(res).success()
  }
  ////// helpers ================================
  tryCatchActions(actionName:string){
    return async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
      try{
        let self:any=this;
      await self[actionName](req, res, next) //await this[actionName](req,res,next);
      return;
      }catch(err){
        this.responce(res).error(err);
      }
    }
  }
}

