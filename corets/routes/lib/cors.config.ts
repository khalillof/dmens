import  Cors  from 'cors';
import {config} from '../../bin/config'

const corsOptions = (req:any, callback:Function)=> callback(null, {origin: config.cores_domains.indexOf(req.header('Origin')) !== -1 ? true:false});


export const cors = Cors();
export const corsWithOptions = Cors(corsOptions);