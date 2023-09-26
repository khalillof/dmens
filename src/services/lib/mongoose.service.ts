import {Express} from 'express';
import mongoose from 'mongoose';
import { config, dbStore} from '../../common/index.js';
import { Configration} from '../../operations/index.js';
/////////////////
const dbOptions = {
  //rejectUnauthorized: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //retryWrites: false
};

export function dbInit(app: Express) {
  console.log('db connction string :' + config.databaseUrl());

  return new Promise(async (resolve) => {
    try {
      //await mongoose.set('strictQuery', true).connect(config.databaseUrl())
      await mongoose.connect(config.databaseUrl())
      console.log("Successfully Connected to db!");

      // Create Configration - Account - default directory  db models and routes
    let num  = await  Configration.create_default_models_routes(app)

      console.log('Numbers of models added to the database are :' + num.length);
      resolve(num.length)
      
    } catch (err: any) {
      console.error(err);
      process.exit(1);
    }
  })
}




