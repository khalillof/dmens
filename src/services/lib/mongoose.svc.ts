import mongoose from 'mongoose';
import {dbStore, envs} from '../../common/index.js';
import { Operations} from '../../operations/index.js';
/////////////////
const dbOptions = {
  //rejectUnauthorized: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //retryWrites: false
};

export async function dbInit() {
    try {

      envs.logLine('db connction string :' + envs.databaseUrl());

      await mongoose.connect(envs.databaseUrl())
      console.log("Successfully Connected to db!");

      // Create Configration - Account - default directory  db models and routes
    await  Operations.create_default_models_routes()

     envs.logLine(`Numbers of models on the database are : ${dbStore.length}`);

    } catch (err: any) {
      console.error(err);
      process.exit(1);
    }
}




