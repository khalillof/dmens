"use strict";
const { dbStore } = require('../common/customTypes/types.config');

class DefaultController {

  constructor(name) {
    this.db = dbStore[name];
  }

  static async createInstance(svcName) {
    return await Promise.resolve(new DefaultController(svcName));
  }
  ToList(self=this) {
    return async (req, res, next)=>{
      let items =  await self.db.Tolist(20, 0);
      res.json({success:true, items:items})
    }
  }
  create(self) {
    return async (req, res, next) => {
     let item = await self.db.create(...req.body);
        console.log('document Created :', item);
        res.json({ success:true, id: item.id });
    }
  }


  getById(self) {
    return async (req, res, next) => {
     let item = await self.db.getById(req.params.id);
        res.json({success:true,item:item})
    }
  }

  patch(self) {
    return async (req, res, next) => {
     await self.db.patchById(req.params.Id, ...req.body);
        self.sendJson({ "status": "OK" }, 204, res);
    }
  }

  put(self) {
    return async (req, res, next) => {
      await self.putById(req.params.Id, ...req.body);
        self.sendJson({ "status": "OK" }, 204, res);
    }
  }

  remove(self) {
    return async (req, res, next) => {
      await self.db.deleteById(req.params.id);
        self.sendJson({ "status": "OK" }, 204, res);
    }
  }

  ////// helpers
  extractId(req, res, next) {
    req.body.id = req.params.id;
    next();
  }
  sendJson(obj, status, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(obj);
  }

  resultCb ={
    res:(res,next,callback)=>{
       return {
         cb:(err, obj)=> {
            if (err)
              //res.json({ success: false, message: 'operation Unsuccessful!', err: err })
              next(err)
            else if (obj) {
              typeof callback ==='function'? callback(obj) : res.json({ success: true, message: 'operation Successful!' })
            }
            else if(!err && !obj) {
              res.json({ success: false, message: 'operation Unsuccessful!', err: 'error' })
            }   
          }    
       }
  }}
}

exports.DefaultController = DefaultController;
