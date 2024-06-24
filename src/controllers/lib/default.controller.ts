import express from 'express';
import { logger, responce, Assert} from '../../common/index.js';
import { Store } from '../../services/index.js';
import { Ilogger, Iresponce, IController, IModelDb, IRequestFilter } from '../../interfaces/index.js';
import { authenticate } from '../../services/index.js';

export class DefaultController implements IController {
  db: IModelDb;
  responce: Iresponce;
  log: Ilogger;
  constructor(name: string) {
    this.db = Store.db.get(name)!;
    this.responce = responce;
    this.log = logger;
  }

  async count(req: express.Request, res: express.Response, next: express.NextFunction) {
    let num = await this.db.model?.countDocuments(req.query)
    this.responce(res).data(num!)
  }

  async form(req: express.Request, res: express.Response, next: express.NextFunction) {
    let _form = await this.db.config.genForm!()
    this.responce(res).data(_form)
  }
  
  async viewData(req: express.Request, res: express.Response, next: express.NextFunction) {
    let data = this.db.config.getViewData!()
    this.responce(res).data(data)
  }
  
  async route(req: express.Request, res: express.Response, next: express.NextFunction) {
    let routes = this.db.config.getRoutes!()
    this.responce(res).data(routes)
  }

  async search(req: express.Request, res: express.Response, next: express.NextFunction) {

    if (!req.query) {
      return this.responce(res).data([]);
    }

    // extract key value from request.query object
    let key = Object.keys(req.query)[0]
    let value = req.query[key] as string
    // chech string is safe
    Assert.iSafeString(value)

    // the following three lines validate the reqested Key is actually present in the model schema properties
    let iskeyInModel = this.db.model?.schema.pathType(key)
    if ("real nested virtual".indexOf(iskeyInModel!) === -1) {
      return this.responce(res).data([]);
    }

    const docs = await this.db.Tolist({ [key]: new RegExp(`${value}`, 'i') });

    this.responce(res).data(docs!);

  }

  getQueryData(filter: Record<string, any>): IRequestFilter {

    if (!filter) {
      return {};
    }

    let _limit = filter['limit'], _page = filter['page'], _sort = filter['sort'], _total = filter['total'];

    const limit = _limit ? Number(_limit) : 5;
    const page = _page ? Number(_page) : 1;
    const sort = (_sort && (_sort === "1" || _sort === "-1")) ? Number(_sort) : 1;
    const total = _total ? Boolean(_total) : undefined;

    limit && (delete filter['limit'])
    page && (delete filter['page'])
    sort && (delete filter['sort'])
    total && (delete filter['total'])
   
    return { filter, limit, page, sort, total };
  }

  async list(req: express.Request, res: express.Response, next: express.NextFunction) {
    let { filter, limit, page, sort, total } = this.getQueryData(req.query)
    let items = await this.db.Tolist(filter, limit, page, sort);
    let _total = total ? await this.db.model?.countDocuments(filter) : undefined;

    // console.log(`filter = ${filter}, limit =${limit}, page =${page}, sort = ${sort}, total =${total}`)

    this.responce(res).data(items, undefined, _total)
  }

  async getOne(req: express.Request, res: express.Response, next: express.NextFunction) {
    //console.log('hello paramas :',req.params)
    let q = req.params['id'] ? { _id: req.params['id'] } : req.query;
    if (!q) {
      return this.responce(res).badRequest()
    }
    let item = await this.db.findOne(q);
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

  async update(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.db.putById(req.params['id'], req.body);
    this.responce(res).success()
  }
  async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = await this.db.deleteById(req.params['id']);
    console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`)
    this.responce(res).success()
  }

  test(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.responce(res).data(req.user)
  }

  ////// helpers ================================
  tryCatch(actionName: string) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        let self: any = this;
        await self[actionName](req, res, next)
        return;
      } catch (err) {
        this.responce(res).error(err);
      }
    }
  }
}

