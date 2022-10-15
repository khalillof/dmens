import mongoose from 'mongoose';
import { config } from '../../common/index.js';
import { JsonLoad } from '../../models/index.js';
/////////////////
const dbOptions = {
    //rejectUnauthorized: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false
};
export function dbInit() {
    console.log('db connction string :' + config.databaseUrl());
    return new Promise(async (resolve) => {
        try {
            await mongoose.connect(config.databaseUrl(), dbOptions);
            console.log("Successfully Connected to db!");
            let num = await JsonLoad.loadDefaultDirectory();
            console.log('Numbers of models added to the database are :' + num.length);
            resolve(num.length);
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    });
}
