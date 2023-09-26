import { cors,corsWithOptions} from './lib/cors.config.js';
import {AuthRoutes} from './lib/auth.routes.config.js';
import {DefaultRoutesConfig, getMware} from './lib/default.routes.config.js';

import {ConfigRoutes} from './lib/config.routes.config.js';
import {uploadImages, uploadSchema} from './lib/uploads.js';


export { corsWithOptions,cors,DefaultRoutesConfig,ConfigRoutes, AuthRoutes, uploadImages, uploadSchema, getMware}