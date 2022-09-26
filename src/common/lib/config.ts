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
function getAbsolutePath(p:string){
  return path.join(baseDir,p)
}
export const config = {
    isDevelopment,
    baseDir,
    getAbsolutePath,
    port:()=> getOr('PORT',3000),
    admin_email:()=> getOr('ADMIN_EMAIL', ''),
    admin_userName: ()=> getOr('ADMIN_USERNAME',''),
    admin_password: ()=> getOr('ADMIN_PASSWORD', ''),
    getSecret:getOr,
    useAuth: ()=> getOr('AUTH', true),
    useCore: ()=> getOr('USE_CORES',true),
    secretKey: ()=>  getOr('SECRET_KEY', ' '),
    jwtSecret:()=> getOr('JWT_SECRET', ' '),
    jwtExpiration:()=> Number(getOr('JWT_EXPIRATION','3600')),// 1 hour
    jwtRefreshExpiration: ()=> Number(getOr('JWT_REFRESH_EXPIRATION','86400')),// 24 hour
    issuer:  ()=> getOr('ISSUER'),//'accounts.examplesoft.com',
    audience: ()=> getOr('AUDIENCE'), //'yoursite.net'
    schemaDir: ()=> getOr('SCHEMA_DIR',getAbsolutePath('models/schema')),
    getSchemaUploadPath: (name:string | any)=> path.join(config.schemaDir(),`${name}.${Date.now()}.json`),
    imagesUploadDir: ()=> getOr('IMAGES_UPLOAD_DIR',getAbsolutePath('public/images')),
    allow_origins:()=>  getOr('CORES_DMAINS', [])?.split(',').map((e:string) => e.trim()),
    static_urls:()=>  getOr('STATIC_URL',[])?.split(',').map((e:string) => e.trim()),
    databaseUrl:()=> getOr('DATABASE_URL'),// will throw error if connection string not provided
    facebook: {
        'clientId': ()=> getOr('FACEBOOK_CLIENT_ID', ' '),
        'clientSecret':()=> getOr('FACEBOOK_CLIENT_SECRET', ' '),
        'callbackUrl': ()=> getOr('FACEBOOK_CALLBACK_URL', ''),
    }
};



