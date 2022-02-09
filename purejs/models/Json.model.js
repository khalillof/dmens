"use strict";
const mongoose = require("mongoose");
const passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
const { dbStore} = require('../common/customTypes/types.config');
const {PassportStrategies} = require('../auth/services/strategies');

class JsonModel {

    constructor(jsonSchema) {

        this.name = jsonSchema.name.toLowerCase() || "";
        this.schema = new mongoose.Schema(jsonSchema.schema, { timestamps: true }); 

        if (this.name === 'user') {
          
            this.schema.plugin(passportLocalMongoose);
            const User = mongoose.model(this.name, this.schema);         
            //passport.use(new Strategy(User.authenticate()));
            passport.use(User.createStrategy());
            passport.serializeUser(User.serializeUser());
             passport.deserializeUser(User.deserializeUser());
             // extras
            passport.use(PassportStrategies.Facebook());
            passport.use(PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy());
            //passport.use(PassportStrategies.JwtQueryParameterStrategy());
            // assign
            this.model = User;
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
      async First(obj) {
        return await this.model.findOne(obj);
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