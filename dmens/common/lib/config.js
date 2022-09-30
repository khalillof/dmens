import { env } from 'process';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url);
const baseDir = path.resolve(path.dirname(__dirname).replace('lib', '').replace('common', ''));
const isDevelopment = () => env['NODE_ENV'] === 'development';
function devOrProd(dev, prod, or = baseDir) {
    return isDevelopment() ? getOr(dev, or) : getOr(prod, or);
}
function getOr(key, or = null) {
    return env[key] ?? or;
}
function getAbsolutePath(p) {
    return path.join(baseDir, p);
}
export const config = {
    isDevelopment,
    baseDir,
    getAbsolutePath,
    port: () => getOr('PORT', 3000),
    admin_email: () => getOr('ADMIN_EMAIL', ''),
    admin_userName: () => getOr('ADMIN_USERNAME', ''),
    admin_password: () => getOr('ADMIN_PASSWORD', ''),
    getSecret: getOr,
    useAuth: () => getOr('AUTH', true),
    useCore: () => getOr('USE_CORES', true),
    secretKey: () => getOr('SECRET_KEY', ' '),
    jwtSecret: () => getOr('JWT_SECRET', ' '),
    jwtExpiration: () => Number(getOr('JWT_EXPIRATION', '3600')),
    jwtRefreshExpiration: () => Number(getOr('JWT_REFRESH_EXPIRATION', '86400')),
    issuer: () => getOr('ISSUER'),
    audience: () => getOr('AUDIENCE'),
    schemaDir: () => getOr('SCHEMA_DIR', getAbsolutePath('models/schema')),
    getSchemaUploadPath: (name) => path.join(config.schemaDir(), `${name}.${Date.now()}.json`),
    imagesUploadDir: () => getOr('IMAGES_UPLOAD_DIR', getAbsolutePath('public/images')),
    allow_origins: () => getOr('CORES_DMAINS', [])?.split(',').map((e) => e.trim()),
    static_urls: () => getOr('STATIC_URL', [])?.split(',').map((e) => e.trim()),
    databaseUrl: () => getOr('DATABASE_URL'),
    facebook: {
        'clientId': () => getOr('FACEBOOK_CLIENT_ID', ' '),
        'clientSecret': () => getOr('FACEBOOK_CLIENT_SECRET', ' '),
        'callbackUrl': () => getOr('FACEBOOK_CALLBACK_URL', ''),
    }
};
