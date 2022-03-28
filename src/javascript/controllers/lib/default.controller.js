//"use strict";
const {dbStore, logger, responce} = require('../../common')


class DefaultController {

  constructor(name) { 
        this.db = dbStore[name];
        this.responce = responce;
     this.log = logger;

  }

  // factory method
  static async createInstance(svcName) {
    return await Promise.resolve(new this(svcName));
  }

  async list(req, res, next) {
    let items = await this.db.Tolist(20, 0,req.query);
    this.responce(res).items(items)
  }

  async findById(req, res, next) {
    let item = await this.db.findById(req.params.id);
    this.responce(res).item(item)
  }
  async findOne(req, res, next) {
    let item = await this.db.findOne(req.query);
    this.responce(res).item(item)
  }
  async create(req, res, next) {
      let item = await  this.db.create(req.body);
      this.log.log('document Created :', item);
      this.responce(res).item(item)
      
  }

  async patch(req, res, next) {
    await this.db.patchById(req.params.Id, ...req.body);
    this.responce(res).success()
  }

  async put(req, res, next) {
    await this.db.putById(req.params.Id, ...req.body);
    this.responce(res).success()
  }
  
  async remove(req, res, next) {
   let item = await this.db.deleteById(req.params.id);
   console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`)
    this.responce(res).success()
  }
  ////// helpers ================================
  tryCatchActions(actionName){
    return async (req, res, next)=>{
      try{
       await this[actionName](req, res, next);
       return;
      }catch(err){
        this.responce(res).error(err)
      }
    }
  }

}

exports.DefaultController = DefaultController;
