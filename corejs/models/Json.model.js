"use strict";
const mongoose = require("mongoose");
const passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
const { dbStore} = require('../common/customTypes/types.config');
const {PassportStrategies} = require('../auth/services/strategies');
const {DefaultRoutesConfig} = require('../routes/default.routes.config')
const {DefaultController} = require('../controllers/default.controller')
class JsonModel {

  constructor(jsonSchema, callback = null) {
  if(jsonSchema){
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
        // add routes
       new DefaultRoutesConfig(this.name, new DefaultController(this.name));
        
    }
    
  }else if(typeof callback === 'function') {
           callback(this);
  }
  
    // add to db store
    dbStore[this.name] = this;
    console.log("added ( " + this.name + " ) to DbStore :");
  }

  static async createInstance(jsonModel, callback) {
    let dbb = new JsonModel(jsonModel, callback);
    return await Promise.resolve(dbb);
  }

  async create(obj) {
    return await this.model.create(obj);
  }
  async query(obj_query) {
    return await this.model.find(obj_query);
  }
  async getById(id) {
    return await this.model.findOne({ _id: id });
  }
  async First(obj) {
    return await this.model.findOne(obj);
  }

  async putById(id, objFields) {
    return await this.model.findByIdAndUpdate(id, objFields);
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async Tolist(limit = 25, page = 0) {
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