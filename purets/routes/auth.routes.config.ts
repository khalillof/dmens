import express from 'express';
import {AuthController} from '../controllers/auth.controller';
import {DefaultRoutesConfig} from './default.routes.config'
//app, '/auth',  AuthController
export async function AuthRoutes(app: express.Application){
    
    return await DefaultRoutesConfig.instance(app,'/auth', await AuthController.createInstance(), function(self:DefaultRoutesConfig):void{

        self.app.post('/auth',
        self.corsWithOption,
        self.controller.authMWare.validateBodyRequest(self.controller),
        self.controller.authMWare.verifyUserPassword(self.controller),
        self.controller.createJWT(self.controller)
    );

    self.app.post('/auth/refresh-token',
        self.corsWithOption,
        self.controller.jwtMWare.validJWTNeeded(self.controller),
        self.controller.jwtMWare.verifyRefreshBodyField(self.controller),
        self.controller.jwtMWare.validRefreshNeeded(self.controller),
        self.controller.createJWT(self.controller)
    );
        });
};
