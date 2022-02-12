"use strict";
const {AuthController }= require('../controllers/auth.controller');
const {DefaultController}= require('../controllers/default.controller');
const {DefaultRoutesConfig} = require('./default.routes.config');

async function AuthRoutes(app){

    return await DefaultRoutesConfig.instance(app,'/auth', await AuthController.createInstance(), function(self){

           self.app.post('/auth',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields,
                self.controller.createJWT
            );
    
            self.app.post('/auth/refresh-token',
                self.corsWithOption,
                self.controller.jwtMWare.validJWTNeeded,
                self.controller.jwtMWare.verifyRefreshBodyField,
                self.controller.jwtMWare.validRefreshNeeded,
                self.controller.createJWT
            );
        });
};

exports.AuthRoutes = AuthRoutes;