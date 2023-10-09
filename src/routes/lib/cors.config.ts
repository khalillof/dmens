import  Cors  from 'cors';
import {envConfig} from '../../common/index.js'

//const corsOptions = (req:any, callback:Function)=> callback(null, {origin: config.cores_domains().indexOf(req.header('Origin')) !== -1});
    const getOptions=(origin:boolean)=> ({
      origin,"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    })
    

function corsOptionsDelegate(req:any, callback:any) {
  
    let origin = req.header('Origin'); 
    const whiteList = envConfig.allow_origins();

    let corsOptions;
    if (whiteList.indexOf(origin) !== -1) {
      corsOptions = getOptions(true) // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = getOptions(false) // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }


 const cors = Cors();
 const corsWithOptions = Cors(corsOptionsDelegate);

 export {cors,corsWithOptions}