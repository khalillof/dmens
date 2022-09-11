import  Cors  from 'cors';
import {config} from '../../common/index.js'

//const corsOptions = (req:any, callback:Function)=> callback(null, {origin: config.cores_domains().indexOf(req.header('Origin')) !== -1});

var corsOptionsDelegate = function (req:any, callback:any) {
  
    const whiteList = config.allow_origins();
    let origin = req.header('Origin'); 

    let corsOptions;
    if (whiteList.indexOf(origin) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }


 const cors = Cors();
 const corsWithOptions = Cors(corsOptionsDelegate);

 export {cors,corsWithOptions}