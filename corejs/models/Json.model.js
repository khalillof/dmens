"use strict";
const mongoose = require("mongoose");
const { dbStore} = require('../common/customTypes/types.config');

class JsonModel {

    constructor(jsonSchema) {

        this.name = jsonSchema.name.toLowerCase() || "";
        this.schema = new mongoose.Schema(jsonSchema.schema, { timestamps: true }); 

        this.model = mongoose.model(this.name, this.schema);

        // add to db store
       dbStore[this.name] = this;
       console.log("added ( "+jsonSchema.name+" ) to DbStore :");
    }

    static async createInstance(jsonModel){
      let dbb =  new JsonModel(jsonModel);
      return await Promise.resolve(dbb);
    }

    async create(obj){
        return await this.model.create(obj);
      }
      async query(obj_query) {
        return await this.model.find(obj_query);
    }
      async getById(id) {
          return await this.model.findById({_id: id});
      }
      async First(obj) {
        return await this.model.findOne(obj);
      }
      
      async putById(id,objFields){
        return await this.model.findByIdAndUpdate(id, objFields);
      }
      
      async deleteById(id) {
        return await this.model.findByIdAndDelete(id);
      }
      
      async Tolist(limit = 25, page= 0) {
          return await this.model.find()
              .limit(limit)
              .skip(limit * page)
              .exec();
      }
      
      async patchById(id, objFields) {
       return await this.model.findOneAndUpdate(id, objFields);
      }
}

exports.JsonModel = JsonModel;