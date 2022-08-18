import {env} from 'process';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname =fileURLToPath(import.meta.url);
const baseDir = path.resolve(path.dirname(__dirname).replace('lib','').replace('common',''));
const isDevelopment = ()=> env['NODE_ENV'] === 'development';

export const config = {
    baseDir,
    port:()=> env['PORT'] || 3000,
    admin_email:()=> env['ADMIN_EMAIL']!,
    admin_userName: ()=> env['ADMIN_USERNAME']!,
    admin_password: ()=> env['ADMIN_PASSWORD']!,
    getSecret:(key:string)=> env[key] ?? null,
    useAuth: ()=> env['AUTH'] || true,
    useCore: ()=> env['USE_CORES'] || true,
    secretKey: ()=>  env['SECRET_KEY']!,
    jwtSecret:()=> env['JWT_SECRET']!,
    jwtExpiration:()=> Number((env['JWT_EXPIRATION'] || '3600')),// 1 hour
    jwtRefreshExpiration: ()=> Number((env['JWT_REFRESH_EXPIRATION'] || '86400')),// 24 hour
    issuer:  ()=> env['ISSUER']!,//'accounts.examplesoft.com',
    audience: ()=> env['AUDIENCE']!, //'yoursite.net'
    schemaDir: ()=> isDevelopment() ? (env['SCHEMA_DIR_DEV'] ?? baseDir) : (env['SCHEMA_DIR_PROD'] ?? baseDir),
    getSchemaUploadPath: ()=> path.join(config.schemaDir(),`/schema.${Date.now()}.json`),
    imagesUploadDir: ()=> isDevelopment() ? (env['IMAGES_UPLOAD_DIR_DEV'] ?? baseDir) : (env['IMAGES_UPLOAD_DIR_PROD'] ?? baseDir),
    cores_domains:()=>  isDevelopment() ? env['CORES_DMAINS_DEV']?.split(',') || [] : env['CORES_DMAINS_PROD']?.split(',') || [],
    static_urls:()=>  isDevelopment() ? env['STATIC_URL_DEV']?.split(',') || [] : env['STATIC_URL_PROD']?.split(',') || [],
    allow_origin:()=>  isDevelopment() ? env['ORIGIN_DEV']?? baseDir : env['ORIGIN_PROD']?? baseDir,
    mongoUrl: {
        'cosmodb':()=> env['COSMOSDB_CON']!,
        'dev': ()=> env['DB_CONNECTION_DEV']!,
        'prod': ()=>  env['DB_CONNECTION_PROD'],
        'admin': ()=> env['DB_CONNECTION_ADMIN'],
        'cluster': ()=> env['DB_CONNECTION_CLUSTER'],
        'docker': () => env['DB_DOCKER']
    },
    facebook: {
        'clientId': ()=> env['FACEBOOK_CLIENT_ID']!,
        'clientSecret':()=> env['FACEBOOK_CLIENT_SECRET']!,
        'callbackUrl': ()=> env['FACEBOOK_CALLBACK_URL']!,
    }
};

