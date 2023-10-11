import { cors,corsWithOptions} from './lib/cors.config.js';
import {AccountRoutes} from './lib/account.routes.config.js';
import {DefaultRoutesConfig} from './lib/default.routes.config.js';

import {ConfigRoutes} from './lib/config.routes.config.js';
import {uploadImages, uploadSchema} from './lib/uploads.js';


export { corsWithOptions,cors,DefaultRoutesConfig,ConfigRoutes, AccountRoutes, uploadImages, uploadSchema}