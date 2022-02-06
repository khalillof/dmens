"use strict";
const {AuthController }= require('../controllers/auth.controller');
const {DefaultRoutesConfig} = require('./default.routes.config');

async function AuthRoutes(app){

    return await DefaultRoutesConfig.instance(app,'/auth', await AuthController.createInstance(), function(self){

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

exports.AuthRoutes = AuthRoutes;