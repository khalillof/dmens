const {corsWithOptions, cors} = require('./lib/cors.config');
const {DefaultRoutesConfig} = require('./lib/default.routes.config');
const {UsersRoutes} = require('./lib/users.routes.config');
const {AuthRoutes} = require('./lib/auth.routes.config');
const {EditorRoutes} = require('./lib/editor.routes.config');
//const {initCustomRoutes} = require('./lib/init.routes.config');

const initdefaultRoutes= async()=> await DefaultRoutesConfig.createInstancesWithDefault();
const initRouteStore = [UsersRoutes,AuthRoutes,initdefaultRoutes, EditorRoutes]
module.exports ={ corsWithOptions,cors,DefaultRoutesConfig, UsersRoutes,AuthRoutes,initdefaultRoutes, EditorRoutes, initRouteStore}
