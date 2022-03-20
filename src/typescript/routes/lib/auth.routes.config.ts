
import {AuthController} from '../../controllers';
import {DefaultRoutesConfig} from './default.routes.config'
import { dbStore } from '../../common';


export async function AuthRoutes(){
    
    return dbStore['account'] ? await Promise.resolve( await DefaultRoutesConfig.instance('/auth', await AuthController.createInstance('account'), function(self:DefaultRoutesConfig):void{

        self.router.post('/auth',
        self.corsWithOption,
        self.mWares!.validateRequiredUserBodyFields,
        self.controller.createJWT
    );

    self.router.post('/auth/refresh-token',
        self.corsWithOption,
        self.controller.createJWT
    );
})) : console.log('Account model is not avaliable in dbStore No Auth routes configuered');;
};