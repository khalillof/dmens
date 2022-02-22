"use strict";
const { dbStore } = require('../../common/customTypes/types.config');
const {AssertionError} = require('../../common/customTypes/assertionError')
class DefaultController {

  constructor(name) {
    this.db = dbStore[name] ? dbStore[name] : null;
  }

  static async createInstance(svcName) {
    return await Promise.resolve(new DefaultController(svcName));
  }


  async list(req, res, next) {
   await this.tryCatchRes(res, async ()=>{
    let items = await this.db.Tolist(20, 0);
    res.json({ success: true, items: items })
    })
  

  }
  async create(req, res, next) {
    let item = await this.db.create(...req.body);
    console.log('document Created :', item);
    res.json({ success: true, id: item.id });
  }


  async getById(req, res, next) {
    let item = await this.db.getById(req.params.id);
    res.json({ success: true, item: item || {} })
  }

  async patch(req, res, next) {
    await this.db.patchById(req.params.Id, ...req.body);
    this.sendJson({ "status": "OK" }, 204, res);
  }

  async put(req, res, next) {
    await this.putById(req.params.Id, ...req.body);
    this.sendJson({ "status": "OK" }, 204, res);
  }

  async remove(req, res, next) {
    await this.db.deleteById(req.params.id);
    this.sendJson({ "status": "OK" }, 204, res);
  }


  ////// helpers
  async tryCatchRes(res, funToFire) {
    try {
      // fire only - res
       await funToFire()
    } catch (err) {
      console.error(err.stack)
      res.json({ success: false, error: err instanceof AssertionError ? err.message : 'error operarion faild' })
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

  callBack = {
    res: (res,done) => {
      return {
        cb: (err, obj) => {
          if (err) {
            console.error(err.stack)
            res.json({ success: false, error: err instanceof AssertionError ? err.message : 'operation faild!' })
            
          } else if (obj) {
            typeof done === 'function' ? done(obj) : res.json({ success: true, message: 'operation Successful!' })
          }
          else if (!err && !obj) {
            res.json({ success: false, message: 'Operation faild!', error: info ? info : 'error' })
          }
        }
      }
    }
  }
}

exports.DefaultController = DefaultController;
