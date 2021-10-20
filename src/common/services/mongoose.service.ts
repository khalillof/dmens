
import mongoose from 'mongoose';
import {IJsonModel} from '../customTypes/types.config'
import {config} from '../../bin/config'
import {loadJsons} from '../../models/load.jsons'
/////////////////
export async function dbInit() {
  
  // connect to db
  mongoose.connect(config.mongoUrl.dev, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify : false,
    useCreateIndex : true
  });
  mongoose.connection.on('error',
    console.error.bind(console, 'connection error:'))
    .on('open',()=> console.log("Successfully Connected to db!") );

 await loadJsons().then((data:Array<IJsonModel>)=>{
  console.log('total models : '+data.length)
  // data.forEach(d=>console.log('loaded: '+d.name+' db models') )
}).catch((err)=> {
  console.error(err);
});
}
