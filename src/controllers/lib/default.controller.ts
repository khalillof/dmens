import express from 'express';
import { dbStore,logger, responce, Assert} from '../../common/index.js';
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

  async count(req: express.Request, res: express.Response, next: express.NextFunction){
  let num =  await this.db.model?.countDocuments(req.query)
  this.responce(res).data(num!)
  }
  
  async search(req: express.Request, res: express.Response, next: express.NextFunction){

    if(!req.query){
    return this.responce(res).data([]);
    }

    // extract key value from request.query object
    let key=Object.keys(req.query)[0]
    let value = req.query[key] as string
  // chech string is safe
  Assert.iSafeString(value)
    // the following three lines validate the reqested Key is actually present in the model schema properties
    let iskeyInModel = this.db.model?.schema.pathType(key)
    if("real nested virtual".indexOf(iskeyInModel!) === -1){
    return this.responce(res).data([]);
  }
   // const docs = await this.db.model?.find({ [key]: { $regex: value } });
   const docs = await this.db.Tolist({ [key]:  new RegExp(`${value}`,'i')  });
 
     this.responce(res).data(docs!);  

      }

getQueryData(query: Record<string,string | any>){

if(query){
  let _limit = query['limit'];
  let _page = query['page'];
  let _sort = query['sort'];
  
  const  limit = _limit ? Number(_limit) : 5;
  const  page = _page ? Number(_page) : 1;
  const  sort = _sort && "1-1".includes(_sort)  ? Number(_sort) : 1;

  page && (delete query['page'])
  page && (delete query['limit'])
  page && (delete query['sort'])

  return {filter: query,limit,page,sort};

  }else{
    return {}
  }
}

  async list(req: express.Request, res: express.Response, next: express.NextFunction) {
        const {filter,limit,page,sort} =this.getQueryData(req.query);
        let items = await this.db.Tolist(filter,limit,page,sort)
        this.responce(res).data(items)
  }

  async getOne(req: express.Request, res: express.Response, next: express.NextFunction) {
    let q = req.params['id'] ? {_id:req.params['id']} : req.query;
    if(!q ){
    return this.responce(res).badRequest()
    }
    let item = await this.db.findOne(q);
    this.responce(res).data(item)
  }
  async post(req: express.Request, res: express.Response, next: express.NextFunction) {
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
  async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
   let item = await this.db.deleteById(req.params['id']);
   console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`)
    this.responce(res).success()
  }
  ////// helpers ================================
  tryCatch(actionName:string){
    return async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
      try{
        let self:any=this;
      await self[actionName](req, res, next) 
      return;
      }catch(err){
        this.responce(res).error(err);
      }
    }
  }
}

