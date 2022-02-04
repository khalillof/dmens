import express from 'express';
import {AuthController} from '../controllers/auth.controller';
import {AuthMiddleware} from '../auth/middlewares/auth.middleware';
import {JwtMiddleware} from '../auth/middlewares/jwt.middleware';
import {DefaultRoutesConfig} from './default.routes.config'
//app, '/auth',  AuthController
export async function AuthRoutes(app: express.Application){
    
    const authMWare = await AuthMiddleware.getInstance();
    const jwtMWare = await JwtMiddleware.getInstance();
    return await DefaultRoutesConfig.instance(app,'/auth', await AuthController.createInstance(), function(self:DefaultRoutesConfig):void{

           // self.app.route('/auth').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
           self.app.post('/auth',
                self.corsWithOption,
                authMWare.validateBodyRequest,
                authMWare.verifyUserPassword,
                self.controller.createJWT
            );
    
            //self.app.route('/auth/refresh-token').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/auth/refresh-token',
                self.corsWithOption,
                jwtMWare.validJWTNeeded,
                jwtMWare.verifyRefreshBodyField,
                jwtMWare.validRefreshNeeded,
                self.controller.createJWT
            );
        });
};
