"use strict";
import mongoose from 'mongoose';
import {dbStore} from '../../common/index.js'
import {JsonSchema, IJsonModel} from '../../interfaces/index.js'
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import {PassportStrategies} from './strategies.js' ;

export class JsonModel implements IJsonModel {

  
  constructor(jsonSchema?:JsonSchema, callback?:any) {
    let self:any = this;
  if(jsonSchema){
    this.name = jsonSchema.name.toLowerCase() || "";
    this.populates = jsonSchema.populates!;
    this.hasPopulate  = jsonSchema.populates &&  jsonSchema.populates.length ? true : false;
   
    if(dbStore[this.name]){
      throw new Error('there is already model on Db with this name : '+this.name)
    }

    this.schema = new mongoose.Schema(jsonSchema.schema as any, { timestamps: true }); 

    if (this.name === 'account') {
      
        this.schema.plugin(passportLocalMongoose);
        const Account :any = mongoose.model(this.name, this.schema);         
        //passport.use(new Strategy(User.authenticate()));
        passport.use(Account.createStrategy());
        passport.serializeUser(Account.serializeUser());
         passport.deserializeUser(Account.deserializeUser());
         // extras
        passport.use(PassportStrategies.FacebookToken());
        passport.use(PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy());
        //passport.use(PassportStrategies.JwtQueryParameterStrategy());
        // assign
        this.model = Account;
    } else {
        this.model = mongoose.model(this.name, this.schema);       
    }
    
  }else if(typeof callback === 'function') {
           callback(this);
  }else{
    throw new Error('jsonSchema is required')
  }
  
    // add to db store
    dbStore[this.name] = self;
    console.log("added ( " + this.name + " ) to DbStore :");

    //this.#loadPopulates(jsonSchema?.schema); 
   
    if (this.hasPopulate){
      this.#buildPopulates();
      
      self.Tolist = new Function('limit=25', 'page=0', 'query={}', `return this.model.find(query).limit(limit).skip(limit * page)${this.#populateQuery}`);
      self.findById = new Function('id', `return this.model.findById(id)${this.#populateQuery}`);
      self.findOne = new Function('query', `return this.model.findOne(query)${this.#populateQuery}`);
    }
  }

  name: string= "";
  schema?:mongoose.Schema ;
  model?:mongoose.Model<any>;
  populates:Array<string> = [];
  hasPopulate: boolean= false;
  #populateQuery="";
  log =console.log;

  #buildPopulates(){
    if(this.hasPopulate) {
      this.populates.forEach(item=>  this.#populateQuery +=".populate('"+item+"')"); 
      this.#populateQuery+=".exec()";
    }
  }

 #loadPopulates(_schema?:any){
  
      // check and load populates
      Object.entries(_schema ??  this.schema!.obj).forEach((item, indx,arr) => this.#deepSearch(item, indx, arr));
      
      this.#buildPopulates();
  }


  // search item in object and map to mongoose schema
#deepSearch(obj:any, indx:number, arr:Array<any>) {
    // loop over the item
    for (let [itemKey, itemValue] of Object.entries(obj))  {           
    
      // check if item is object then call deepSearch agin recursively
       if (typeof itemValue === "object") {
           this.#deepSearch(itemValue, indx,arr)           
       } else {
         if(itemKey === 'ref'){
         //console.log(arr[indx][0])
          this.populates.push(arr[indx][0])
         }
       }
   }
}

  static async createInstance(jsonModel?:JsonSchema, callback?:any) {
    let dbb = new JsonModel(jsonModel, callback);
    return  dbb;
  }

  async Tolist(limit=25, page= 0, query={}){
        let self:any =this;
    return await self.model!.find(query)
      .limit(limit)
      .skip(limit * page)
      .exec(); 

  }

async findById(id: string) {
 return await this.model!.findById(id);
}
async findOne(query: {}) {
  return await this.model!.findOne(query);
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
