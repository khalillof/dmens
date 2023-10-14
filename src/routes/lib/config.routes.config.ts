
import { ConfigController } from '../../controllers/index.js';
import { IDefaultRoutesConfig} from '../../interfaces/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';

export async function ConfigRoutes(){
    return  new DefaultRoutesConfig(new ConfigController(),
   async function (this:IDefaultRoutesConfig) {
      await  this.buidRoute(this.routeName+'/routes', 'list', 'routes', ['authenticate', 'isAdmin'])
       await this.defaultRoutes()
        
    }
)
}
