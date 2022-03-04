//"use strict";
const { Error} = require("mongoose");
const {AssertionError} = require('../../common/customTypes/assertionError')
const { dbStore} = require('../../common/customTypes/types.config');

class DefaultController {

  constructor(name) { 
        this.db = dbStore[name];
     
  }

  // factory method
  static async createInstance(svcName) {
    return await Promise.resolve(new this(svcName));
  }

  async list(req, res, next) {
    let items = await this.db.Tolist(20, 0);
    this.resItems(res, items)
  }
  async listQuery(req, res, next) {
    let items = await this.db.Tolist( req.query,20, 0);
    this.resItems(res, items)
  }
  async getOneById(req, res, next) {
    let item = await this.db.getOneById(req.params.id);
    this.resItem(res, item)
  }
  async getOneByQuery(req, res, next) {
    let item = await this.db.getOneByQuery(req.query);
    this.resItem(res, item)
  }
  async create(req, res, next) {
    let item = await this.db.create(req.body);
    this.log('document Created :', item);
    this.resItem(res, item)
  }

  async patch(req, res, next) {
    await this.db.patchById(req.params.Id, ...req.body);
    this.resSuccess(res)
  }

  async put(req, res, next) {
    await this.db.putById(req.params.Id, ...req.body);
    this.resSuccess(res)
  }
  async remove(req, res, next) {
    await this.db.deleteById(req.params.id);
    this.resSuccess(res)
  }
  ////// helpers ================================
  async tryCatch(req, res, next, actionName){
    try{
      await this[actionName](req, res, next) //await this[actionName](req,res,next);
    }catch(err){
      this.resErrIfErr(res,err);
    }
}
  async tryCatchRes(res, fun) {
    try {
      if (typeof fun === 'function') await fun(this)
    } catch (err) {
      this.resErrIfErr(res, err)
    }
  }

  extractId(req, res, next) {
    req.body.id = req.params.id;
    next();
  }
  sendJson(obj, status, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(obj);
  }
  logError(err) {
    if (err) console.error(err.stack)
  }
  log(info) {
    if (info) console.log(info);
  }
  resError(res, message) {
    res.json({ success: false, error: message ? message : 'operation faild!' });
  }
  resErrIfErr(res, err) {
    if (err) {
      this.logError(err)
      this.resError(res, err instanceof Error.ValidationError || err instanceof AssertionError ? err.message : 'operation faild!');
    }
  }
  resSuccess(res, message) { res.json({ success: true, message: message ? message : 'operation Successful!' }) }
  resItems(res, items, message) { res.json({ success: true, message: message ? message : 'operation Successful!', items: items }) }
  resItem(res, items, message) { res.json({ success: true, message: message ? message : 'operation Successful!', item: items }) }
  resErrSuccess(res, err) { err ? this.resError(res, err) : this.resSuccess(res) }
  resErrCb(res, err, callBack) { err ? this.resErrIfErr(res, err) : this.Cb(callBack) }
  resObjCbErr(res, obj, callBack, message) { obj && typeof callBack === 'function' ? callBack(obj) : this.resError(res, message) }
  resObjCbSuccess(res, obj, callBack, message) {
     if (obj){
       typeof callBack === 'function' ? callBack(obj) : this.resSuccess(res, message) 
     }
    }
  resObjSuccessErr(res, obj) { obj ? this.resSuccess(res) : this.resError(res) }

  ObjCb(obj, callBack) { if (obj && typeof callBack === 'function') callBack(obj) }
  Cb(cb) { if (cb && typeof cb === 'function') cb(); }

  callBack(res, cb){
      return {
        done: (err, obj, info) => {
          if(err){
            this.resErrIfErr(res, err);
          }
         else if (obj) {
            this.resObjCbSuccess(res, obj, cb, obj._id ?? '');
          }
          else if (info) {
            res.json({ success: false, message: 'Operation faild!', error: info ?? 'error' });
          }
        },
        errCb: (err) => this.resErrCb(res, err, cb),
        errSuccess: (err) => this.resErrSuccess(res, err)
      }
    }

}

exports.DefaultController = DefaultController;
