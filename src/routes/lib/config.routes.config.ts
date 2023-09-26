
import { AdminController as ConfigController } from '../../controllers/index.js';
import { uploadSchema } from './uploads.js';
import { IRouteConfigCallback } from '../../interfaces/index.js';

export const ConfigRoutes: IRouteConfigCallback = {
    routeName: 'config',
    controller: new ConfigController('config'),
    routeCallback: function () {
        this.defaultRoutes()
        this.buidRoute(this.routeName, 'post', 'post', null, [uploadSchema])
    }
}

