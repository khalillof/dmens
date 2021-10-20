
import mongoose from 'mongoose';
import {dbStore,SvcStore, createInstance,modelStore, IJsonModel} from '../common/customTypes/types.config'
import {config} from '../bin/config'
import {Svc} from '../services/Svc.services'


export class JsonModel implements IJsonModel{
    db?:mongoose.Model<any,any>;
    constructor(jsonModel:IJsonModel) {
        this.name = jsonModel.name;
        this.schema = jsonModel.schema;
        this.model = jsonModel.model;
    }
    name: string;
    schema?:mongoose.Schema | any;
    model?:mongoose.Model<any,any> | any;

    getModelName():string{       
        return this.name;
    }

    getSchema():mongoose.Schema{
         return new mongoose.Schema()
    };

    getModel():mongoose.Model<any,any>{
    return mongoose.model(this.name, this.getSchema())
    }

    ///////////////////////////////////////////////////////
    async create(obj: any){
        return this.db?.create(obj);
      }
      
      async getById(objId: string) {
          return await this.db?.findOne({_id: objId});
      }
      
      async putById(objFields: any){
         return await this.db?.findByIdAndUpdate(objFields._id, objFields);
      }
      
      async deleteById(objId: string) {
        return await this.db?.deleteOne({_id: objId});
      }
      
      async Tolist(limit: number = 25, page: number = 0) {
          return  this.db?.find()
              .limit(limit)
              .skip(limit * page)
              .exec();
      }
      
      async patchById(objFields: any) {
       return await this.db?.findOneAndUpdate(objFields._id, objFields);
      }
}