import { env } from 'process';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url);
const baseDir = path.resolve(path.dirname(__dirname).replace('lib', '').replace('common', ''));
const isDevelopment = () => env['NODE_ENV'] === 'development';
const getOr = (key, or = null) => env[key] ?? or;
const getAbsolutePath = (p) => path.join(baseDir, p);
export const envConfig = {
    isDevelopment,
    baseDir,
    getAbsolutePath,
    port: () => getOr('PORT', 3000),
    admin_email: () => getOr('ADMIN_EMAIL', ''),
    admin_userName: () => getOr('ADMIN_USERNAME', ''),
    admin_password: () => getOr('ADMIN_PASSWORD', ''),
    getSecret: getOr,
    authStrategy: () => {
        let authStr = getOr('AUTH_STRAtEGY', 'jwt').toLowerCase();
        if ("jwt az".indexOf(authStr) !== -1) {
            return authStr === 'az' ? 'oauth-bearer' : authStr;
        }
        else {
            throw new Error(`>>> ${authStr} : >>>  auth strategy does not exist`);
        }
    },
    useCore: () => getOr('USE_CORES', true),
    secretKey: () => getOr('SECRET_KEY', ' '),
    jwtSecret: () => getOr('JWT_SECRET', ' '),
    jwtExpiration: () => Number(getOr('JWT_EXPIRATION', '3600')),
    jwtRefreshExpiration: () => Number(getOr('JWT_REFRESH_EXPIRATION', '86400')),
    issuer: () => getOr('ISSUER'),
    audience: () => getOr('AUDIENCE'),
    schemaDir: () => getOr('SCHEMA_DIR', getAbsolutePath('models/schema')),
    getSchemaUploadPath: (name) => path.join(envConfig.schemaDir(), `${name}.${Date.now()}.json`),
    imagesUploadDir: () => getOr('IMAGES_UPLOAD_DIR', getAbsolutePath('public/images')),
    allow_origins: () => getOr('CORES_DMAINS', [])?.split(',').map((e) => e.trim()),
    static_urls: () => getOr('STATIC_URL', [])?.split(',').map((e) => e.trim()),
    databaseUrl: () => getOr('DATABASE_URL'),
    logLine: (...args) => {
        console.log('================================================>>> \n', ...args);
    },
    throwErr: (msg = "unknown error") => {
        throw new Error(msg);
    }
};
