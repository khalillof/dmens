"use strict";
import {Model ,Schema , model} from 'mongoose';
import {JsonSchema, dbStore} from '../../common'
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import {PassportStrategies} from './strategies' ;

export class JsonModel {

  constructor(jsonSchema?:JsonSchema, callback?:any) {

  if(jsonSchema){
    this.name = jsonSchema.name.toLowerCase() || "";

    if(dbStore[this.name]){
      throw new Error('there is already model on Db with this name : '+this.name)
    }

    this.schema = new Schema(jsonSchema.schema, { timestamps: true }); 

    this.#loadPopulates(jsonSchema.schema); 

    if (this.name === 'account') {
      
        this.schema.plugin(passportLocalMongoose);
        const Account :any = model(this.name, this.schema);         
        //passport.use(new Strategy(User.authenticate()));
        passport.use(Account.createStrategy());
        passport.serializeUser(Account.serializeUser());
         passport.deserializeUser(Account.deserializeUser());
         // extras
        passport.use(PassportStrategies.Facebook());
        //passport.use(PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy());
        passport.use(PassportStrategies.JwtQueryParameterStrategy());
        // assign
        this.model = Account;
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
  populateNames:Array<string> = [];
  hasPopulate: boolean= false;
  #populateBuilder="";
  log =console.log;

  #loadPopulates(_schema?:any){

      // check and load populates
      Object.entries(_schema ??  this.schema!.obj).forEach((item, indx,arr) => this.#deepSearch(item, indx, arr));
      
      this.hasPopulate = this.populateNames.length > 0 ;
      if(this.hasPopulate) {
        //console.log('========= this model => ( ' + this.name +' ) require popluate : ' + this.populate );
        this.populateNames.forEach(item=> this.#populateBuilder +=".populate('"+item+"')");
        this.#populateBuilder+=".exec()";
      }
  }

  async #factory(stringObj:string){
    this.log(stringObj);
    return await eval(stringObj);
  }
  async #getOnePopulated(arg:any, method='findById'){
      let builder = `this.model.${method}(${JSON.stringify(arg)})${this.#populateBuilder}`;
      return await this.#factory(builder);
  }
  
  async #getListPopulated(limit=25, page= 0, query={}){
    let builder = `this.model.find(${JSON.stringify(query)}).limit(${limit}).skip(${(limit * page)})${this.#populateBuilder}`;
    return await this.#factory(builder);
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
          this.populateNames.push(arr[indx][0])
         }
       }
   }
}

  static async createInstance(jsonModel?:any, callback?:any) {
    let dbb = new JsonModel(jsonModel, callback);
    return await Promise.resolve(dbb);
  }

  async Tolist(limit: number = 25, page: number = 0, query={}) {
    return this.hasPopulate ? 
    await this.#getListPopulated(limit,page,query) : 
    await this.model!.find(query)
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

async getOneById(id: string) {
  return this.hasPopulate ? await this.#getOnePopulated(id): await this.model!.findById(id);
}
async getOneByQuery(query: {}) {
  return this.hasPopulate ? await this.#getOnePopulated(query,'findOne'): await this.model!.findOne(query);
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
