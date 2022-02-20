import  Cors  from 'cors';
import {env} from 'process'

const whitelist : any  = env.NODE_ENV === 'development'? env.CORES_DMAINS_DEV?.split(',') : env.CORES_DMAINS_PROD?.split(',');

const corsOptions = (req:any, callback:Function)=> callback(null, {origin: whitelist.indexOf(req.header('Origin')) !== -1 ? true:false});


export const cors = Cors();
export const corsWithOptions = Cors(corsOptions);