import {env} from 'process';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname =fileURLToPath(import.meta.url);
const baseDir = path.resolve(path.dirname(__dirname).replace('lib','').replace('common',''));


export const config = {
    baseDir,
    port:()=> env['PORT'] || 3000,
    admin_email:()=> env['ADMIN_EMAIL']!,
    admin_userName: ()=> env['ADMIN_USERNAME']!,
    admin_password: ()=> env['ADMIN_PASSWORD']!,
    useAuth: ()=> env['AUTH'] || true,
    useCore: ()=> env['USE_CORES'] || true,
    secretKey: ()=>  env['SECRET_KEY']!,
    jwtSecret:()=> env['JWT_SECRET']!,
    jwtExpiration:()=> Number((env['JWT_EXPIRATION'] || '3600')),// 1 hour
    jwtRefreshExpiration: ()=> Number((env['JWT_REFRESH_EXPIRATION'] || '86400')),// 24 hour
    issuer:  ()=> env['ISSUER']!,//'accounts.examplesoft.com',
    audience: ()=> env['AUDIENCE']!, //'yoursite.net'
    schemaDir: ()=> env['SCHEMA_DIR'] || path.join(baseDir, '/models/schema/'),
    getSchemaUploadPath: ()=> path.join(config.schemaDir(),`/schema.${Date.now()}.json`),
    imagesUploadDir: ()=> env['IMAGES_UPLOAD_DIR'] || path.join(baseDir, '/public/'),
    cores_domains:()=>  env['NODE_ENV'] === 'development'? env['CORES_DMAINS_DEV']?.split(',') || [] : env['CORES_DMAINS_PROD']?.split(',') || [],
    mongoUrl: {
        'dev': ()=> env['DB_CONNECTION_DEV']!,
        'prod': ()=>  env['DB_CONNECTION_PROD'],
        'admin': ()=> env['DB_CONNECTION_ADMIN'],
        'cluster': ()=> env['DB_CONNECTION_CLUSTER']!
    },
    facebook: {
        'clientId': ()=> env['FACEBOOK_CLIENT_ID']!,
        'clientSecret':()=> env['FACEBOOK_CLIENT_SECRET']!,
        'callbackUrl': ()=> env['FACEBOOK_CALLBACK_URL']!,
    }
};

