
import {AuthController} from '../../controllers';
import {DefaultRoutesConfig} from './default.routes.config'
//app, '/auth',  AuthController
export async function AuthRoutes(){
    
    return await DefaultRoutesConfig.instance('/auth', await AuthController.createInstance(), function(self:DefaultRoutesConfig):void{

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
});
};