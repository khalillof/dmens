
import {AuthController} from '../../controllers';
import {DefaultRoutesConfig} from './default.routes.config'
import { dbStore } from '../../common/customTypes/types.config';


export async function AuthRoutes(){
    
    return dbStore['user'] ? await DefaultRoutesConfig.instance('/auth', await AuthController.createInstance(), function(self:DefaultRoutesConfig):void{

        self.router.post('/auth',
        self.corsWithOption,
        self.UsersMWare.validateRequiredUserBodyFields,
        self.controller.createJWT
    );

    self.router.post('/auth/refresh-token',
        self.corsWithOption,
        self.controller.jwtMWare.validJWTNeeded,
        self.controller.jwtMWare.verifyRefreshBodyField,
        self.controller.jwtMWare.validRefreshNeeded,
        self.controller.createJWT
    );
}) : console.log('User model is not avaliable in dbStore No Auth routes configuered');;
};