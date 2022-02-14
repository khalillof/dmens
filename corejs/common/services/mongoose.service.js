"use strict";
const mongoose =require('mongoose');
const { config } =require('../../bin/config');
const { JsonLoad }=require('../../models/json.load');
/////////////////
const dbOptions ={
      rejectUnauthorized: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

 async function dbInit(){
 return  await dbConnect(config.mongoUrl.dev,dbOptions);
}
async function dbConnect (dbURL, options){
  console.log("=========== db initiation started ===============")
  mongoose.connect(dbURL, options, async function(err){
    if (err) {
      console.error(err);
      process.exit(1);
     }
     else{
      console.log("Successfully Connected to db!");
       await JsonLoad.createInstance();
     } 
   }); 
   
}


exports.dbInit = dbInit;

