
import { AdminController as ConfigController } from '../../controllers/index.js';
import { uploadSchema } from './uploads.js';
import { IRouteConfigCallback, IDefaultRoutesConfig} from '../../interfaces/index.js';
import { ConfigProps } from '../../models/index.js';

export const ConfigRoutes: IRouteConfigCallback = {
    config:  new ConfigProps({name:'config', active:true,schemaObj:{}}),
    controller: ()=> new ConfigController(),
    routeCallback: function (this:IDefaultRoutesConfig) {
        this.defaultRoutes()
        this.buidRoute(this.routeName, 'post', 'post', null, [this.mware!.isJson,uploadSchema])
        this.buidRoute(this.routeName, 'put', 'put', null, [this.mware!.isJson,uploadSchema])
    }
}

