import { cors,corsWithOptions} from './lib/cors.config';
import {AuthRoutes} from './lib/auth.routes.config';
import {DefaultRoutesConfig} from './lib/default.routes.config';
import {IndexRoutes} from './lib/init.routes.config';
import {UsersRoutes} from './lib/users.routes.config';
import {EditorRoutes} from './lib/editor.routes.config';

const initRouteStore = [UsersRoutes,AuthRoutes, EditorRoutes,IndexRoutes, DefaultRoutesConfig.createInstancesWithDefault ]
export { corsWithOptions,cors,DefaultRoutesConfig, UsersRoutes,AuthRoutes,EditorRoutes,IndexRoutes, initRouteStore}