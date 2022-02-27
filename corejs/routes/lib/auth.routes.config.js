"use strict";
const { DefaultRoutesConfig} = require('./default.routes.config');
const {AuthController} = require('../../controllers')

async function AuthRoutes() {

    // add routes
    return await Promise.resolve( DefaultRoutesConfig.instance('/auth', await AuthController.createInstance('user'),
        function (self) {
            self.router.all('/auth',self.corsWithOption);
            self.router.post('/auth',
                self.UsersMWare.validateRequiredUserBodyFields,
                self.controller.createJWT
            );

            self.router.post('/auth/refresh-token',
                self.controller.jwtMWare.validJWTNeeded,
                self.controller.jwtMWare.verifyRefreshBodyField,
                self.controller.jwtMWare.validRefreshNeeded,
                self.controller.createJWT
            );
        }))

};

exports.AuthRoutes = AuthRoutes;