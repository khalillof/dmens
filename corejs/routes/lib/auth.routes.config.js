"use strict";
const { DefaultRoutesConfig} = require('./default.routes.config');
const {AuthController} = require('../../controllers')
async function AuthRoutes() {

    // add routes
    return await DefaultRoutesConfig.instance('/auth', await AuthController.createInstance(),
        function (self) {

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
        })

};

exports.AuthRoutes = AuthRoutes;