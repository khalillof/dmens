
import { ConfigController } from '../../controllers/index.js';
import { IDefaultRoutesConfig } from '../../interfaces/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';

export async function ConfigRoutes() {
    return new DefaultRoutesConfig(new ConfigController(),
        async function (this: IDefaultRoutesConfig) {

            await this.buidRoute(this.addPath('/routes'), 'get', 'routes', ['authenticate', 'isAdmin'])
            await this.buidRoute(this.addPath('/route/delete'), 'delete', 'deleteRoute', ['authenticate', 'isAdmin'])
            await this.buidRoute(this.addPath('/forms'), 'get', 'forms') 
            await this.buidRoute(this.addPath('/routesdata'), 'get', 'routesdata') 
            await this.defaultRoutes()

        }
    )
}
