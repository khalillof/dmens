"use strict";
const { model,Schema} = require("mongoose");
const passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
const { dbStore} = require('../common/customTypes/types.config');
const {PassportStrategies} = require('../auth/services/strategies');

class JsonModel {

  constructor(jsonSchema, callback = null) {
  if(jsonSchema){
    this.name = jsonSchema.name.toLowerCase() || "";
    if(dbStore[this.name]){
      throw new Error('there is already model in this name : '+this.name)
    }
    this.schema = new Schema(jsonSchema.schema, { timestamps: true }); 

    if (this.name === 'user') {
      
        this.schema.plugin(passportLocalMongoose);
        const User = model(this.name, this.schema);         
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
        this.model = model(this.name, this.schema);  
    }
    
  }else if(typeof callback === 'function') {
           callback(this);
  }
  
    // add to db store
    dbStore[this.name] = this;
    console.log("added ( " + this.name + " ) to DbStore :");
  }

  static async createInstance(json_schema, callback) {
    let DB = new JsonModel(json_schema, callback);
     // add routes
    return await Promise.resolve(DB);
  }

  async Tolist(limit = 25, page = 0) {
    return await this.model.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
  async TolistQuery( query,limit = 25, page = 0) {
    return await this.model.find(query)
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
  async getOneById(id) {
    return await this.model.findById(id);
  }
  async getOneByQuery(query) {
    return await this.model.findOne(query);
  }

  async create(obj) {
    return await this.model.create(obj);
  }

  async putById(id, objFields) {
    return await this.model.findByIdAndUpdate(id, objFields);
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }
  async deleteByQuery(query) {
    return await this.model.findOneAndDelete(query);
  }

  async patchById(id, objFields) {
    return await this.model.findOneAndUpdate(id, objFields);
  }
}

exports.JsonModel = JsonModel;