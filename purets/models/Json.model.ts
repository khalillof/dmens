import mongoose, { Schema, Model} from 'mongoose';
import {JsonSchema, dbStore} from '../common/customTypes/types.config'
import passport from 'passport';
import passportLocalMongoose = require('passport-local-mongoose');
import {PassportStrategies} from '../auth/services/strategies' ;

export class JsonModel implements JsonSchema{

    constructor(jsonMdl:JsonSchema) {
        this.name = jsonMdl.name.toLowerCase() || "";
        this.schema = new Schema(jsonMdl.schema, { timestamps: true }); 

        if (this.name === 'user') {
            this.schema.plugin(passportLocalMongoose);
            const User = mongoose.model(this.name, this.schema);         
            //passport.use(new LocalStrategy(User.authenticate()));
            passport.use(User.createStrategy());
            passport.serializeUser(User.serializeUser);
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

        // add to dbStore
        dbStore[this.name] = this;
        console.log("added ( "+jsonMdl.name+" ) to DbStore :");
    }
    name: string;
    schema:mongoose.Schema | any ;
    model:mongoose.Model<any,any> | any;

    public static async createInstance(jsonModel:JsonSchema){
      let dbb =  new JsonModel(jsonModel);
      return await Promise.resolve(dbb);
    }

   
    async create(obj: any){
        return await this.model.create(obj);
      }
      
      async getById(id: string) {
          return await this.model.findOne({_id: id});
      }
      async First(obj:any) {
        return await this.model.findOne(obj);
      }
      async putById(objFields: any){
         return await this.model.findByIdAndUpdate(objFields._id, objFields);
      }
      
      async deleteById(id: string) {
        return await this.model.deleteOne({_id: id});
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