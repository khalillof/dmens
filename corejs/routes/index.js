const {corsWithOptions, cors} = require('./lib/cors.config');
const {DefaultRoutesConfig} = require('./lib/default.routes.config');
const {UsersRoutes} = require('./lib/users.routes.config');
const {AuthRoutes} = require('./lib/auth.routes.config');
const {SchemaRoutes} = require('./lib/schema.routes.config');
//const {initCustomRoutes} = require('./lib/init.routes.config');

const initdefaultRoutes= async()=> await DefaultRoutesConfig.createInstancesWithDefault();
const initRouteStore = [UsersRoutes,AuthRoutes,initdefaultRoutes, SchemaRoutes]
module.exports ={ corsWithOptions,cors,DefaultRoutesConfig, UsersRoutes,AuthRoutes,initdefaultRoutes, SchemaRoutes, initRouteStore}
