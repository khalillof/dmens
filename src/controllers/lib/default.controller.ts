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

  isSafeString(str:string, res:any){ 
        Assert.string(str)
        Assert.safeString(str); 
    }
  
  async search(req: express.Request, res: express.Response, next: express.NextFunction){

    if(!req.query){
    return this.responce(res).data([]);
    }

    // extract key value from request.query object
    let key=Object.keys(req.query)[0]
    let value = req.query[key] as string
  // chech string is safe
    this.isSafeString(value, res)
    // the following three lines validate the reqested Key is actually present in the model schema properties
    let iskeyInModel = this.db.model?.schema.pathType(key)
    if("real nested virtual".indexOf(iskeyInModel!) === -1){
    return this.responce(res).data([]);
  }
   // const docs = await this.db.model?.find({ [key]: { $regex: value } });
   const docs = await this.db.Tolist({ [key]:  new RegExp(`${value}`,'i')  });
 
     this.responce(res).data(docs!);  

      }
getQueryData(req: any){

if(req.query){
  let filter:any = req.query;
  const  limit = (filter && filter.limit) ? parseInt(filter.limit as string) : 10;
  const  page = (filter && filter.page) ? parseInt(filter.page as string) : 1;
  const  sort = (filter && filter.sort && (filter.sort === '1' || filter.sort === '-1')) ? parseInt(filter.sort as string) : 1;

    page && (delete filter['page'])
    page && (delete filter['limit'])
    page && (delete filter['sort'])

    return {filter,limit,page,sort};
  
  }else{
    return {}
  }
}


  async list(req: express.Request, res: express.Response, next: express.NextFunction) {
        const {filter,limit,page,sort} =this.getQueryData(req);
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
  tryCatchActions(actionName:string){
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

