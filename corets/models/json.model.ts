"use strict";
import {Model ,Schema , model} from 'mongoose';
import {JsonSchema, dbStore} from '../common/customTypes/types.config'
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import {PassportStrategies} from '../auth/services/strategies' ;

export class JsonModel {

  constructor(jsonSchema?:JsonSchema, callback?:any) {
  if(jsonSchema){
    this.name = jsonSchema.name.toLowerCase() || "";

    if(dbStore[this.name]){
      throw new Error('there is already model in this name : '+this.name)
    }

    this.schema = new Schema(jsonSchema.schema, { timestamps: true }); 

    if (this.name === 'user') {
      
        this.schema.plugin(passportLocalMongoose);
        const User :any = model(this.name, this.schema);         
        //passport.use(new Strategy(User.authenticate()));
        passport.use(User.createStrategy());
        passport.serializeUser(User.serializeUser());
         passport.deserializeUser(User.deserializeUser());
         // extras
        passport.use(PassportStrategies.Facebook());
        passport.use(PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy());
        //passport.use(PassportStrategies.JwtQueryParameterStrategy());
        // assign
        this.db = User;
    } else {
        this.db = model(this.name, this.schema);       
    }
    
  }else if(typeof callback === 'function') {
           callback(this);
  }else{
    throw new Error('jsonSchema is required')
  }
  
    // add to db store
    dbStore[this.name] = this;
    console.log("added ( " + this.name + " ) to DbStore :");
  }

  name: string= "";
  schema?:Schema ;
  db?:Model<any>;

  static async createInstance(jsonModel?:any, callback?:any) {
    let dbb = new JsonModel(jsonModel, callback);
    return await Promise.resolve(dbb);
  }
  async Tolist(limit: number = 25, page: number = 0, query=null) {
    return await this.db?.find(query)
        .limit(limit)
        .skip(limit * page)
        .exec();
}

async getOneById(id: string) {
  return await this.db?.findById(id);
}
async getOneByQuery(query: {}) {
  return await this.db?.findOne(query);
}
  async create(obj: object){
    return await this.db?.create(obj);
  }

  async putById(id:string, objFields: object){
     return await this.db?.findByIdAndUpdate(id, objFields);
  }
  
  async deleteById(id: string) {
    return await this.db?.findByIdAndDelete(id);
  }
  async deleteByQuery(query:{}) {
    return await this.db?.findOneAndDelete(query);
  }
  async patchById(objFields: any) {
   return await this.db?.findOneAndUpdate(objFields._id, objFields);
  }
}
