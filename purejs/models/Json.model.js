"use strict";
const mongoose = require("mongoose");
const passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
const { Strategy} = require('passport-local');
const { dbStore} = require('../common/customTypes/types.config');

class JsonModel {

    constructor(jsonSchema) {

        this.name = jsonSchema.name.toLowerCase() || "";
        this.schema = new mongoose.Schema(jsonSchema.schema, { timestamps: true }); 

        if (this.name === 'user') {
            this.schema.plugin(passportLocalMongoose);
            const vm = mongoose.model(this.name, this.schema);
            passport.use(new Strategy(vm.authenticate()));
            passport.serializeUser(vm.serializeUser);
            passport.deserializeUser(vm.deserializeUser());
            this.model = vm;
        } else {
            this.model = mongoose.model(this.name, this.schema);
            
        }

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
      
      async getById(id) {
          return await this.model.findOne({_id: id});
      }
      
      async putById(objFields){
        return await this.model.findByIdAndUpdate(objFields._id, objFields);
      }
      
      async deleteById(id) {
        return await this.model.deleteOne({_id: id});
      }
      
      async Tolist(limit = 25, page= 0) {
          return await this.model.find()
              .limit(limit)
              .skip(limit * page)
              .exec();
      }
      
      async patchById(objFields) {
       return await this.model.findOneAndUpdate(objFields._id, objFields);
      }
}

exports.JsonModel = JsonModel;