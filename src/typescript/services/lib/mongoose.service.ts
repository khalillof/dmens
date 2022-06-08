
import mongoose from 'mongoose';
import { config } from '../../common/index.js';
import {JsonLoad } from '../../models/index.js';
/////////////////
const dbOptions ={
  rejectUnauthorized: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export async function dbInit(){
  console.log('db connction string :'+config.mongoUrl.dev());

return Promise.resolve(mongoose.connect(config.mongoUrl.dev(), dbOptions, async function(err){

if (err) {
  console.error(err);
  process.exit(1);
 }
 else{
  console.log("Successfully Connected to db!");
  console.log('Numbers of models added to the database are :'+ (await JsonLoad.loadDefaultDirectory()).length);
 } 
})); 
}




