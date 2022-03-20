const {corsWithOptions, cors} = require('./lib/cors.config');
const {DefaultRoutesConfig} = require('./lib/default.routes.config');
const {AccountsRoutes} = require('./lib/accounts.routes.config');
const {AuthRoutes} = require('./lib/auth.routes.config');
const {EditorRoutes} = require('./lib/editor.routes.config');
const {uploadImages,uploadSchema} = require('./lib/upload');


const initRouteStore = [AccountsRoutes,AuthRoutes, EditorRoutes, DefaultRoutesConfig.createInstancesWithDefault]

module.exports ={ corsWithOptions,cors,DefaultRoutesConfig,initRouteStore,uploadImages,uploadSchema }
