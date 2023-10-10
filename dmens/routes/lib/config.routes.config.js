import { AdminController as ConfigController } from '../../controllers/index.js';
import { ConfigProps } from '../../models/index.js';
export const ConfigRoutes = {
    config: new ConfigProps({ name: 'config', active: true, schemaObj: {} }),
    controller: () => new ConfigController(),
    routeCallback: function () {
        this.defaultRoutes();
        this.buidRoute(this.routeName, 'post', 'post', this.configProp.middlewares);
        this.buidRoute(this.routeName, 'put', 'put', this.configProp.middlewares);
        this.buidRoute(this.routeName + '/routes', 'list', 'routes', ['isAuthenticated', 'isAdmin']);
    }
};
