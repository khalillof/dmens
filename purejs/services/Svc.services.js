
"use strict";
//const {JsonModel} = require('../models/Json.model');

Object.defineProperty(exports, "__esModule", { value: true });

 class Svc {


    constructor(svc) {
        this.db = svc;
    }
    static  async createInstance(data){
      var result = new Svc(data);
      return  await Promise.resolve(result);
      }
      
 async create(obj){
  let res =this.db.create(obj)
  return  await Promise.resolve(res);
}

async getById(objId) {
    return await this.db.findOne({_id: objId});
}

async putById(objFields){
   return await this.db.findByIdAndUpdate(objFields._id, objFields);
}

async deleteById(objId) {
  return await this.db.deleteOne({_id: objId});
}

async Tolist(limit = 25, page = 0) {
    return  this.db.find()
        .limit(limit)
        .skip(limit * page)
        .exec();
}

async patchById(objFields) {
 return await this.db.findOneAndUpdate(objFields._id, objFields);
}
}

exports.Svc = Svc;

