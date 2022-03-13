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

    this.loadPopulateNames(jsonSchema.schema); 
    this.hasPopulate = this.populate.length > 0 ;
    if(this.hasPopulate) {
      console.log('========= this model => ( ' + this.name +' ) require popluate : ' + this.populate );
    }
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
        this.model = User;
    } else {
        this.model = model(this.name, this.schema);       
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
  model?:Model<any>;
  populate:Array<string> = [];
  hasPopulate: boolean= false;
  loadPopulateNames(_schema?:any){
    Object.entries(_schema ??  this.schema!.obj).forEach((item, indx,arr) => this.deepSearch(item, indx, arr));
  }
  // search item in object and map to mongoose schema
 deepSearch(obj:any, indx:number, arr:Array<any>) {

    // loop over the item
    for (let [itemKey, itemValue] of Object.entries(obj))  {           
    
      // check if item is object then call deepSearch agin recursively
       if (typeof itemValue === "object") {
           this.deepSearch(itemValue, indx,arr)           
       } else {
         if(itemKey === 'ref'){
         //console.log(arr[indx][0])
          this.populate.push(arr[indx][0])
         }
       }
   }
}

async getPopulate(id:string){
  let populatebuilder = "this.model.findById('"+id+"')";
  this.populate.forEach(item=> populatebuilder +=".populate('"+item+"')");
  populatebuilder+='.exec()';

  return await eval("(" + populatebuilder + ")");
}

  static async createInstance(jsonModel?:any, callback?:any) {
    let dbb = new JsonModel(jsonModel, callback);
    return await Promise.resolve(dbb);
  }
  async Tolist(limit: number = 25, page: number = 0, query=null) {
    return await this.model?.find(query)
        .limit(limit)
        .skip(limit * page)
        .exec();
}

async getOneById(id: string) {
  return this.hasPopulate ? await this.getPopulate(id): await this.model!.findById(id);
}
async getOneByQuery(query: {}) {
  return await this.model?.findOne(query);
}
  async create(obj: object){
    return await this.model?.create(obj);
  }

  async putById(id:string, objFields: object){
     return await this.model?.findByIdAndUpdate(id, objFields);
  }
  
  async deleteById(id: string) {
    return await this.model?.findByIdAndDelete(id);
  }
  async deleteByQuery(query:{}) {
    return await this.model?.findOneAndDelete(query);
  }
  async patchById(objFields: any) {
   return await this.model?.findOneAndUpdate(objFields._id, objFields);
  }
}
