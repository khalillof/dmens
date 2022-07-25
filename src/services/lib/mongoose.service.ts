
import mongoose from 'mongoose';
import { config } from '../../common/index.js';
import {JsonLoad } from '../../models/index.js';
/////////////////
const dbOptions ={
  //rejectUnauthorized: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
 retryWrites: false
};
/*
export async function dbInit(){
  console.log('db connction string :'+config.mongoUrl.cosmodb());

  mongoose.connect(config.mongoUrl.cosmodb(), dbOptions, async function (err: any) {

    if (err) {
      console.error(err);
      process.exit(1);
    }
    else {
      console.log("Successfully Connected to db!");
      console.log('Numbers of models added to the database are :' + (await JsonLoad.loadDefaultDirectory()).length);
    }
  }); 
}
*/
export async function dbInit(){
  console.log('db connction string :'+config.mongoUrl.cluster());

  mongoose.connect(config.mongoUrl.cluster()!, dbOptions).then(async ()=> (await JsonLoad.loadDefaultDirectory()).length
  ).then((num:any)=>{
    console.log("Successfully Connected to db!");
    console.log('Numbers of models added to the database are :' + num);
    return num;
  }).catch((err: any)=> {
      console.error(err);
      process.exit(1);
  }); 
}




