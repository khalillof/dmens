"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
const { Strategy} = require('passport-local');


class JsonModel {

    constructor(jsonMdl) {
        this.name = jsonMdl.name || "";
        this.schema = new mongoose.Schema(jsonMdl.schema, { timestamps: true }); 

        if (jsonMdl.name === 'User') {
            this.schema.plugin(passportLocalMongoose);
            const vm = mongoose.model(this.name, this.schema);
            passport.use(new Strategy(vm.authenticate()));
            passport.serializeUser(vm.serializeUser);
            passport.deserializeUser(vm.deserializeUser());
            this.model = vm;
        console.log("added ( "+jsonMdl.name+" ) to DbStore :")
        } else {
            this.model = mongoose.model(this.name, this.schema);
            console.log("added ( "+jsonMdl.name+" ) to DbStore :")
        }
    }

    static async createInstance(jsonModel){
      let dbb =  new JsonModel(jsonModel);
      return await Promise.resolve(dbb);
    }
    getModelName(){       
        return this.name;
    }

    getSchema(){
        return this.schema;       
    };

    getModel(){
        return this.model;
    }


    async create(obj){
        return await this.model.create(obj);
      }
      
      async getById(objId) {
          return await this.model.findOne({_id: objId});
      }
      
      async putById(objFields){
        return await this.model.findByIdAndUpdate(objFields._id, objFields);
      }
      
      async deleteById(objId) {
        return await this.model.deleteOne({_id: objId});
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