"use strict";
const { dbStore} = require('../../common');
const {PassportStrategies} = require('./strategies');
const {model,Schema} = require("mongoose");
const passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');


class JsonModel {

  constructor(jsonSchema, callback = null) {
    this.log = console.log;
    this.logerr = console.error;
  if(jsonSchema){
    this.name = jsonSchema.name.toLowerCase() || "";
    this.loadref = jsonSchema.loadref ? jsonSchema.loadref  : false;

    if(dbStore[this.name]){
      throw new Error('there is already model in this name : '+this.name)
    }
    this.schema = new Schema(jsonSchema.schema, { timestamps: true }); 

    this.populateNames = [];
    
    this.hasPopulate = false;
    this.#loadPopulates(jsonSchema.schema); 
    
    if (this.name === 'account') {
      
        this.schema.plugin(passportLocalMongoose);
        const Account = model(this.name, this.schema);         
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
        this.model = model(this.name, this.schema); 
      
    }
    
  }else if(typeof callback === 'function') {
           callback(this);
  }
  
    // add to db store
    dbStore[this.name] = this;
    this.log("added ( " + this.name + " ) to DbStore :");
  }
  #populateBuilder = "";

  #loadPopulates(_schema = null){
    // check and load populates
    Object.entries(_schema ??  this.schema.obj).forEach((item, indx,arr) => this.#deepSearch(item, indx, arr));
    
    this.hasPopulate = this.populateNames.length > 0 ;
    if(this.hasPopulate) {
      //console.log('========= this model => ( ' + this.name +' ) require popluate : ' + this.populate );
      this.populateNames.forEach(item=> this.#populateBuilder +=".populate('"+item+"')");
      this.#populateBuilder+=".exec()";
    }

  }
  
  // search item in object and map to mongoose schema
 #deepSearch(obj, indx,arr) {
     
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
async #factory(stringObj){
  this.log('factory method : '+ stringObj);
  return await eval(stringObj);
}
async #getOnePopulated(arg, method='findById'){
    let builder = `this.model.${method}(${JSON.stringify(arg)})${this.#populateBuilder}`;
    return await this.#factory(builder);
}

async #getListPopulated(limit=25, page= 0, query=null){
  let builder = `this.model.find(${JSON.stringify(query)}).limit(${limit}).skip(${(limit * page)})${this.#populateBuilder}`;
  return await this.#factory(builder);
}
  static async createInstance(json_schema, callback) {
    let DB = new JsonModel(json_schema, callback);
     // add routes
    return await Promise.resolve(DB);
  }

  async Tolist(limit=25, page= 0, query=null) {
    return this.loadref && this.hasPopulate ? 
    await this.#getListPopulated(limit,page,query) : 
    await this.model.find(query)
      .limit(limit)
      .skip(limit * page)
      .exec();
      
  }

  async findById(id) {
    return this.loadref && this.hasPopulate ? await this.#getOnePopulated(id): await this.model.findById(id);
  }

  async findOne(query) {
    return this.loadref && this.hasPopulate ? await this.#getOnePopulated(query,'findOne'): await this.model.findOne(query);
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