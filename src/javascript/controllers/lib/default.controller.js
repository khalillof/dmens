//"use strict";
const { Error} = require("mongoose");
const {MongoServerError } = require("mongodb");
const {dbStore, AssertionError} = require('../../common')

class DefaultController {

  constructor(name) { 
        this.db = dbStore[name];
     
  }

  // factory method
  static async createInstance(svcName) {
    return await Promise.resolve(new this(svcName));
  }

  async list(req, res, next) {
    let items = await this.db.Tolist(20, 0,req.query);
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
      let item = await  this.db.create(req.body);
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
  tryCatchActions(actionName){
    return async (req, res, next)=>{
      try{
       await this[actionName](req, res, next) //await this[actionName](req,res,next);
      }catch(err){
        this.resErrIfErr(res,err);
      }
    }
  }
  async tryCatchCallback(res, fun) {
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
  resErrInfo(res, err,info){
    let message = err ? err.message : info.message;
   return res.json({success:false,error: message});
  }
  resErrIfErr(res, err) {
    if (err) {
      this.logError(err)
      let msg = err instanceof Error.ValidationError || err instanceof AssertionError || err instanceof MongoServerError ? err.message : 'operation faild!'
      this.resError(res, msg); 
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

         if (obj) {
          return  this.resObjCbSuccess(res, obj, cb, obj._id ?? '');
          }
          this.resErrInfo(res,err,info);
        },
        errCb: (err) => this.resErrCb(res, err, cb),
        errSuccess: (err) => this.resErrSuccess(res, err)
      }
    }

}

exports.DefaultController = DefaultController;
