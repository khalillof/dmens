"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = exports.envPath = void 0;
const tslib_1 = require("tslib");
const process_1 = require("process");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const isDevelopment = process_1.env['NODE_ENV'] !== 'production';
const baseDir = path_1.default.resolve(path_1.default.dirname(__dirname).replace('lib', '').replace('common', ''));
const envFileName = isDevelopment ? '.env.test' : '.env';
exports.envPath = path_1.default.join(baseDir, envFileName);
// load envirmoment vars
let { error, parsed } = dotenv_1.default.config({ path: exports.envPath });
if (error) {
    throw new Error('enviroment file error :' + error);
}
const getOr = (key, or = null) => process_1.env[key] ?? or;
const getAbsolutePath = (p) => path_1.default.join(baseDir, p);
exports.envs = {
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
    getSchemaUploadPath: (name) => path_1.default.join(exports.envs.schemaDir(), `${name}.${Date.now()}.json`),
    imagesUploadDir: () => getOr('IMAGES_UPLOAD_DIR', getAbsolutePath('public/images')),
    allow_origins: () => getOr('CORES_DMAINS', [])?.split(',').map((e) => e.trim()),
    static_url: () => getOr('STATIC_URL', undefined),
    databaseUrl: () => getOr('DATABASE_URL'),
    logLine: (...args) => {
        console.log('================================================>>> \n', ...args);
    },
    throwErr: (msg = "unknown error") => {
        throw new Error(msg);
    }
};
if (!error && !isDevelopment && fs_1.default.existsSync(exports.envPath)) {
    fs_1.default.unlinkSync(exports.envPath);
    console.log('.env file will be removed');
}
