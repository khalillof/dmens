import mongoose from 'mongoose';
import { dbStore, envConfig} from '../../common/index.js';
import { Configration} from '../../operations/index.js';
/////////////////
const dbOptions = {
  //rejectUnauthorized: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //retryWrites: false
};

export async function dbInit() {
    try {

      envConfig.logLine('db connction string :' + envConfig.databaseUrl());

      await mongoose.connect(envConfig.databaseUrl())
      console.log("Successfully Connected to db!");

      // Create Configration - Account - default directory  db models and routes
    await  Configration.create_default_models_routes()

     envConfig.logLine(`Numbers of models on the database are : ${Object.keys(dbStore).length}`);

    } catch (err: any) {
      console.error(err);
      process.exit(1);
    }
}




