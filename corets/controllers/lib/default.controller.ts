import AssertionError from '../../common/customTypes/assertionError';
import express from 'express';
import { dbStore } from '../../common/customTypes/types.config';

export class DefaultController {
  db: any;
  public constructor(name: string) {
    this.db = dbStore[name];
  }


  static async createInstance(svcName: string) {
    return await Promise.resolve(new this(svcName));
  }
  
  
  async list(req: express.Request, res: express.Response, next: express.NextFunction) {
    let items = await this.db.Tolist(20, 0);
    this.resItems(res, items)
  }
  async listQuery(req: express.Request, res: express.Response, next: express.NextFunction) {
    let items = await this.db.TolistQuery(req.query,20, 0);
    this.resItems(res, items)
  }
  async getOneById(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = await this.db.getOneById(req.params.id);
    this.resItem(res, item)
  }
  async getOneByQuery(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = await this.db.getOneByQuery(req.query);
    this.resItem(res, item)
  }
  async create(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = await this.db.create(...req.body);
    console.log('document Created :', item);
    this.resItem(res, item._id)
  }

  async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.db.patchById(req.params.Id, ...req.body);
    this.resSuccess(res)
  }

  async put(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.db.putById(req.params.Id,req.body);
    this.resSuccess(res)
  }
  async remove(req: express.Request, res: express.Response, next: express.NextFunction) {
    await this.db.deleteById(req.params.id);
    this.resSuccess(res)
  }
  ////// helpers ================================
  async tryCatchRes(res: express.Response, fun: Function) {
    try {
    if (fun && typeof fun === 'function'){ 
      await fun() 
    }else{
      throw new Error('function was expected instead we recived type :' + typeof fun)
    }
    } catch (err: any) {
      this.resErrIfErr(res, err)
    }
  }
  extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
    req.body.id = req.params.id;
    next();
  }
  sendJson(obj: any, status: any, res: express.Response) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(obj);
  }
  logError(err: any) {
    if (err) console.error(err.stack ? err.stack : err)
  }
  log(info: any) {
    if (info) console.log(info);
  }
  resError(res: express.Response, message?: string) {
    res.json({ success: false, error: message ? message : 'operation faild!' });
  }
  resErrIfErr(res: express.Response, err: any,) {
    if (err) {
      this.logError(err)
      this.resError(res, err instanceof AssertionError ? err.message : 'operation faild!');
    }
  }
  resSuccess(res: express.Response, message?: string) { res.json({ success: true, message: message ? message : 'operation Successful!' }) }
  resItems(res: express.Response, items: any, message?: string) { res.json({ success: true, message: message ? message : 'operation Successful!', items: items }) }
  resItem(res: express.Response, items: any, message?: string) { res.json({ success: true, message: message ? message : 'operation Successful!', item: items }) }
  resErrSuccess(res: express.Response, err: any) { err ? this.resError(res, err) : this.resSuccess(res) }
  resErrCb(res: express.Response, err: any, callBack?: Function) { err ? this.resErrIfErr(res, err) : this.Cb(callBack) }
  resObjCbErr(res: express.Response, obj: any, callBack?: Function, message?: string) { obj && typeof callBack === 'function' ? callBack(obj) : this.resError(res, message) }
  resObjCbSuccess(res: express.Response, obj: any, callBack?: Function, message?: string) {
     if (obj){
       typeof callBack === 'function' ? callBack(obj) : this.resSuccess(res, message) 
     }
    }
  resObjSuccessErr(res: express.Response, obj: any) { obj ? this.resSuccess(res) : this.resError(res) }

  ObjCb(obj: any, callBack: Function) { if (obj && typeof callBack === 'function') callBack(obj) }
  Cb(cb?: Function) { if (cb && typeof cb === 'function') cb(); }

  callBack(res: express.Response, cb?: Function){
      return {
        done: (err: any, obj: any, info: any) => {
          if(err){
            this.resErrIfErr(res, err);
          }
         else if (obj) {
            this.resObjCbSuccess(res, obj, cb, obj._id);
          }
          else if (info) {
            res.json({ success: false, message: 'Operation faild!', error: info ?? 'error' });
          }
        },
        errCb: (err: any) => this.resErrCb(res, err, cb),
        errSuccess: (err: any) => this.resErrSuccess(res, err)
      }
    }

}

