"use strict";
import mongoose, { Schema, Model} from 'mongoose';
import {JsonSchema, dbStore} from '../common/customTypes/types.config'
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import {PassportStrategies} from '../auth/services/strategies' ;

export class JsonModel {

  constructor(jsonSchema?:JsonSchema, callback?:any) {
  if(jsonSchema){
    this.name = jsonSchema.name.toLowerCase() || "";
    this.schema = new mongoose.Schema(jsonSchema.schema, { timestamps: true }); 

    if (this.name === 'user') {
      
        this.schema.plugin(passportLocalMongoose);
        const User :any = mongoose.model(this.name, this.schema);         
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
    
  }else if(typeof callback === 'function') {
           callback(this);
  }
  
    // add to db store
    dbStore[this.name] = this;
    console.log("added ( " + this.name + " ) to DbStore :");
  }

  name: string= "";
  schema:mongoose.Schema | any ;
  model:mongoose.Model<any,any> | any;

  static async createInstance(jsonModel?:any, callback?:any) {
    let dbb = new JsonModel(jsonModel, callback);
    return await Promise.resolve(dbb);
  }
  async create(obj: any){
    return await this.model.create(obj);
  }
  async query(obj_query:{}) {
    return await this.model.find(obj_query);
} 
  async getById(id: string) {
      return await this.model.findOne({_id: id});
  }
  async First(obj:any) {
    return await this.model.findOne(obj);
  }
  async putById(id:string, objFields: {}){
     return await this.model.findByIdAndUpdate(id, objFields);
  }
  
  async deleteById(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
  
  async Tolist(limit: number = 25, page: number = 0) {
      return await this.model.find()
          .limit(limit)
          .skip(limit * page)
          .exec();
  }
  
  async patchById(objFields: any) {
   return await this.model.findOneAndUpdate(objFields._id, objFields);
  }
}
