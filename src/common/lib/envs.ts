import {env} from 'process';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const isDevelopment = env['NODE_ENV'] !== 'production';

const baseDir = path.resolve(path.dirname(__dirname).replace('lib','').replace('common',''));
const envFileName = isDevelopment ? '.env.test' : '.env' ;
export const envPath = path.join(baseDir, envFileName);

// load envirmoment vars
if(fs.existsSync(envPath)){
 let {error, parsed } = dotenv.config({ path: envPath });

 if (error) {
  throw new Error('enviroment file error :'+error);
}else{
  // delete .env file
  if (!error && !isDevelopment && fs.existsSync(envPath)) {
    fs.unlinkSync(envPath)
    console.log('.env file will be removed')
  }
}
}else{
  if(!env['NODE_ENV']){
     throw new Error('enviroment does not exist :'+envPath);
  }else{
    console.log('enviroment data found it seems like runing on container enviroment ')
  }
}
const getOr = (key:string, or:any=null)=> env[key] ??  or ;
const getAbsolutePath =(p:string)=> path.join(baseDir,p);

export const envs = {
    isDevelopment,
    baseDir,
    getAbsolutePath,
    port:()=> getOr('PORT',3000),
    admin_email:()=> getOr('ADMIN_EMAIL', ''),
    admin_userName: ()=> getOr('ADMIN_USERNAME',''),
    admin_password: ()=> getOr('ADMIN_PASSWORD', ''),
    getSecret:getOr,
    authStrategy:()=> {
    let authStr =  getOr('AUTH_STRAtEGY', 'jwt').toLowerCase();

    if("jwt az oidc local".indexOf(authStr) !== -1){
      return authStr === 'az' ? 'oauth-bearer' :  authStr;     
    }else{
      throw new Error( `>>> ${authStr} : >>>  auth strategy does not exist`)
    }
    
      },
    useCore: ()=> getOr('USE_CORES',true),
    secretKey: ()=>  getOr('SECRET_KEY', ' '),
    jwtSecret:()=> getOr('JWT_SECRET', ' '),
    jwtExpiration:()=> Number(getOr('JWT_EXPIRATION','3600')),// 1 hour
    jwtRefreshExpiration: ()=> Number(getOr('JWT_REFRESH_EXPIRATION','86400')),// 24 hour
    issuer:  ()=> getOr('ISSUER'),//'accounts.examplesoft.com',
    jwks_uri:()=> getOr('jwks_uri', `${envs.issuer()}.well-known/jwks`),
    audience: ()=> getOr('AUDIENCE'), //'yoursite.net'
    schemaDir: ()=> getOr('SCHEMA_DIR',getAbsolutePath('models/schema')),
    getSchemaUploadPath: (name:string | any)=> path.join(envs.schemaDir(),`${name}.${Date.now()}.json`),
    imagesUploadDir: ()=> getOr('IMAGES_UPLOAD_DIR',getAbsolutePath('public/images')),
    allow_origins:()=>  getOr('CORES_DMAINS', [])?.split(',').map((e:string) => e.trim()),
    static_url:()=>  getOr('STATIC_URL',undefined),
    databaseUrl:()=> getOr('DATABASE_URL'),// will throw error if connection string not provided

  logLine:(...args: any[])=>{
    console.log('================================================>>> \n',...args)
  },
  throwErr:(msg:string="unknown error")=>{
         throw new Error(msg);
  }
};





