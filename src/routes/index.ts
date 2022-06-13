import { cors,corsWithOptions} from './lib/cors.config.js';
import {AuthRoutes} from './lib/auth.routes.config.js';
import {DefaultRoutesConfig} from './lib/default.routes.config.js';
import {IndexRoutes} from './lib/init.routes.config.js';
import {AccountsRoutes} from './lib/accounts.routes.config.js';
import {AdminRoutes} from './lib/admin.routes.config.js';
import {uploadImages, uploadSchema} from './lib/uploads.js';
const initRouteStore = [AccountsRoutes,AuthRoutes, AdminRoutes,IndexRoutes, DefaultRoutesConfig.createInstancesWithDefault ]
export { corsWithOptions,cors,DefaultRoutesConfig,initRouteStore, uploadImages, uploadSchema}