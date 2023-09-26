import { AdminController as ConfigController } from '../../controllers/index.js';
import { uploadSchema } from './uploads.js';
export const ConfigRoutes = {
    routeName: 'config',
    controller: new ConfigController('config'),
    routeCallback: function () {
        this.defaultRoutes();
        this.buidRoute(this.routeName, 'post', 'post', null, [uploadSchema]);
    }
};
