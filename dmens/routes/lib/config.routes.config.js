import { ConfigController } from '../../controllers/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';
export async function ConfigRoutes() {
    return new DefaultRoutesConfig(new ConfigController(), async function () {
        await this.list(this.addPath('/routes'), 'routes', ['authenticate', 'isAdmin']);
        await this.delete(this.addPath('/route/delete'), 'deleteRoute', ['authenticate', 'isAdmin']);
        await this.list(this.addPath('/forms'), 'forms');
        await this.list(this.addPath('/clients'), 'modelClientsData');
        await this.defaultRoutes();
    });
}
