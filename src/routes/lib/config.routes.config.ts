
import { AdminController as ConfigController } from '../../controllers/index.js';
import { uploadSchema } from './uploads.js';
import { IRouteConfigCallback, IDefaultRoutesConfig } from '../../interfaces/index.js';

export const ConfigRoutes: IRouteConfigCallback = {
    routeName: 'config',
    controller: new ConfigController('config'),
    routeCallback: function (this:IDefaultRoutesConfig) {
        this.defaultRoutes()
        this.buidRoute(this.routeName, 'post', 'post', null, [this.mware!.isJson,uploadSchema])
    }
}

