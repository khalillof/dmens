const {corsWithOptions, cors} = require('./lib/cors.config');
const {DefaultRoutesConfig} = require('./lib/default.routes.config');
const {UsersRoutes} = require('./lib/users.routes.config');
const {AuthRoutes} = require('./lib/auth.routes.config');
const {EditorRoutes} = require('./lib/editor.routes.config');
const {uploadImages,uploadSchema} = require('./lib/upload');


const initRouteStore = [UsersRoutes,AuthRoutes, EditorRoutes, DefaultRoutesConfig.createInstancesWithDefault]

module.exports ={ corsWithOptions,cors,DefaultRoutesConfig,initRouteStore,uploadImages,uploadSchema }
