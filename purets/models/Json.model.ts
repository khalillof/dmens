import mongoose, { Schema, Model} from 'mongoose';
import {JsonSchema} from '../common/customTypes/types.config'
import passport from 'passport';
var passportLocalMongoose = require('passport-local-mongoose');
import { Strategy as LocalStrategy } from 'passport-local';

export class JsonModel implements JsonSchema{

    constructor(jsonMdl:JsonSchema) {
        this.name = jsonMdl.name || "";
        this.schema = new Schema(jsonMdl.schema, { timestamps: true }); 

        if (jsonMdl.name === 'User') {
            this.schema.plugin(passportLocalMongoose);
            const vm = mongoose.model(this.name, this.schema);
            passport.use(new LocalStrategy(vm.authenticate()));
            passport.serializeUser(vm.serializeUser);
            passport.deserializeUser(vm.deserializeUser());
            this.model = vm;
        console.log("added Db & Svc to local stores :" + jsonMdl.name)
        } else {
            this.model = mongoose.model(this.name, this.schema);
            console.log("added Db & Svc to local stores :" + jsonMdl.name)
        }
    }
    name: string;
    schema:mongoose.Schema | any ;
    model:mongoose.Model<any,any> | any;

    public static async createInstance(jsonModel:JsonSchema){
      let dbb =  new JsonModel(jsonModel);
      return await Promise.resolve(dbb);
    }
    getModelName():string{       
        return this.name;
    }

    getSchema():mongoose.Schema{
        return this.schema;       
    };

    getModel():mongoose.Model<any,any>{
        return this.model;
    }

    ///////////////////////////////////////////////////////
    async create(obj: any){
        return this.model.create(obj);
      }
      
      async getById(objId: string) {
          return await this.model.findOne({_id: objId});
      }
      
      async putById(objFields: any){
         return await this.model.findByIdAndUpdate(objFields._id, objFields);
      }
      
      async deleteById(objId: string) {
        return await this.model.deleteOne({_id: objId});
      }
      
      async Tolist(limit: number = 25, page: number = 0) {
          return  this.model.find()
              .limit(limit)
              .skip(limit * page)
              .exec();
      }
      
      async patchById(objFields: any) {
       return await this.model.findOneAndUpdate(objFields._id, objFields);
      }
}