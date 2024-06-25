
import { ConfigController } from '../../controllers/index.js';
import { IDefaultRoutesConfig } from '../../interfaces/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';

export async function ConfigRoutes() {

    return new DefaultRoutesConfig(new ConfigController(),
        async function (this: IDefaultRoutesConfig) {
            await this.defaultClientRoutes()
            //await this.defaultRoutes()
            await this.list(this.addPath('/client/routes'),'routes', ['authenticate', 'isAdmin'])
            await this.delete(this.addPath('/route/delete'), 'deleteRoute', ['authenticate', 'isAdmin'])
            await this.list(this.addPath('/client/forms'), 'forms') 
            await this.list(this.addPath('/client/viewsdata'), 'viewsData') 
            await this.list()
            

        }
    )
}
