import { cors,corsWithOptions} from './lib/cors.config';
import {AuthRoutes} from './lib/auth.routes.config';
import {DefaultRoutesConfig} from './lib/default.routes.config';
import {IndexRoutes} from './lib/init.routes.config';
import {UsersRoutes} from './lib/users.routes.config';
import {EditorRoutes} from './lib/editor.routes.config';
//export {cors, corsWithOptions,DefaultRoutesConfig, UsersRoutes,AuthRoutes, initCustomRoutes, EditorRoutes }

const initdefaultRoutes= async()=> await DefaultRoutesConfig.createInstancesWithDefault();
const initRouteStore = [UsersRoutes,AuthRoutes,initdefaultRoutes, EditorRoutes,IndexRoutes ]
export { corsWithOptions,cors,DefaultRoutesConfig, UsersRoutes,AuthRoutes,initdefaultRoutes, EditorRoutes,IndexRoutes, initRouteStore}