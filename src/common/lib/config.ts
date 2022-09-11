import {env} from 'process';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname =fileURLToPath(import.meta.url);
const baseDir = path.resolve(path.dirname(__dirname).replace('lib','').replace('common',''));

const isDevelopment = ()=> env['NODE_ENV'] === 'development';

function devOrProd(dev:string, prod:any, or:string | any =baseDir){
  return  isDevelopment() ? getOr(dev, or) : getOr(prod,or);
}

function getOr(key:string, or:any=null){
    return  env[key] ??  or ;
  }

export const config = {
    isDevelopment,
    baseDir,
    port:()=> getOr('PORT',3000),
    admin_email:()=> getOr('ADMIN_EMAIL'),
    admin_userName: ()=> getOr('ADMIN_USERNAME'),
    admin_password: ()=> getOr('ADMIN_PASSWORD'),
    getSecret:getOr,
    useAuth: ()=> getOr('AUTH', true),
    useCore: ()=> getOr('USE_CORES',true),
    secretKey: ()=>  getOr('SECRET_KEY'),
    jwtSecret:()=> getOr('JWT_SECRET'),
    jwtExpiration:()=> Number(getOr('JWT_EXPIRATION','3600')),// 1 hour
    jwtRefreshExpiration: ()=> Number(getOr('JWT_REFRESH_EXPIRATION','86400')),// 24 hour
    issuer:  ()=> getOr('ISSUER'),//'accounts.examplesoft.com',
    audience: ()=> getOr('AUDIENCE'), //'yoursite.net'
    schemaDir: ()=> devOrProd('SCHEMA_DIR_DEV','SCHEMA_DIR_PROD'),
    getSchemaUploadPath: ()=> path.join(config.schemaDir(),`/schema.${Date.now()}.json`),
    imagesUploadDir: ()=> devOrProd('IMAGES_UPLOAD_DIR_DEV','IMAGES_UPLOAD_DIR_PROD'),
    allow_origins:()=>  devOrProd('CORES_DMAINS_DEV','CORES_DMAINS_PROD', [])?.split(',').map((e:string) => e.trim()),
    static_urls:()=>  devOrProd('STATIC_URL_DEV','STATIC_URL_PROD',[])?.split(',').map((e:string) => e.trim()),
    mongoUrl: {
        'cosmodb':()=> getOr('COSMOSDB_CON'),
        'dev': ()=> getOr('DB_CONNECTION_DEV'),
        'prod': ()=>  getOr('DB_CONNECTION_PROD'),
        'admin': ()=> getOr('DB_CONNECTION_ADMIN'),
        'cluster': ()=> getOr('DB_CONNECTION_CLUSTER'),
        'docker': () => getOr('DB_DOCKER')
    },
    facebook: {
        'clientId': ()=> getOr('FACEBOOK_CLIENT_ID'),
        'clientSecret':()=> getOr('FACEBOOK_CLIENT_SECRET'),
        'callbackUrl': ()=> getOr('FACEBOOK_CALLBACK_URL'),
    }
};



