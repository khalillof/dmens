
import { ConfigController } from '../../controllers/index.js';
import { IDefaultRoutesConfig } from '../../interfaces/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';

export async function ConfigRoutes() {

    return new DefaultRoutesConfig(new ConfigController(),
        async function (this: IDefaultRoutesConfig) {
            await this.defaultExtraRoutes()
            //await this.defaultRoutes()
            await this.addGetExtraRoute('routes', ['authenticate', 'isAdmin'])
            await this.addGetExtraRoute('forms') 
            await this.addGetExtraRoute('viewsdata') 
            
            await this.delete(this.config.routeName+'/route/delete', 'deleteRoute', ['authenticate', 'isAdmin'])
        
            await this.list()
            

        }
    )
}
