import  Cors  from 'cors';
import {config} from '../../common/index.js'

//const corsOptions = (req:any, callback:Function)=> callback(null, {origin: config.cores_domains().indexOf(req.header('Origin')) !== -1});

var corsOptionsDelegate = (req:any, callback:any):any => {
    var corsOptions;
   // console.log(req.header('Origin'));
    if(config.allow_origins().indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true , methods: "GET,HEAD,PUT,PATCH,POST,DELETE"};
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

export const cors = Cors();
export const corsWithOptions = Cors(corsOptionsDelegate);