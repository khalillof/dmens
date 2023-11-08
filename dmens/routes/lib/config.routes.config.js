import { ConfigController } from '../../controllers/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';
export async function ConfigRoutes() {
    return new DefaultRoutesConfig(new ConfigController(), async function () {
        await this.buidRoute(this.addRoutePath('/routes'), 'list', 'routes', ['authenticate', 'isAdmin']);
        await this.buidRoute(this.addRoutePath('/delete/route'), 'delete', 'deleteRoute', ['authenticate', 'isAdmin']);
        await this.buidRoute(this.addRoutePath('/forms'), 'get', 'forms'); // ['authenticate', 'isAdmin']
        await this.buidRoute(this.addRoutePath('/routesdata'), 'get', 'routesdata'); // ['authenticate', 'isAdmin']
        await this.defaultRoutes();
    });
}
