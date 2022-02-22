import { cors,corsWithOptions} from './lib/cors.config';
import {AuthRoutes} from './lib/auth.routes.config';
import {DefaultRoutesConfig} from './lib/default.routes.config';
import {initCustomRoutes} from './lib/init.routes.config';
import {UsersRoutes} from './lib/users.routes.config';
import {SchemaRoutes} from './lib/schema.routes.config';
export {cors, corsWithOptions,DefaultRoutesConfig, UsersRoutes,AuthRoutes, initCustomRoutes, SchemaRoutes }