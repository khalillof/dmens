"use strict";
const { AuthController } = require('../controllers/auth.controller');
const { DefaultRoutesConfig } = require('./default.routes.config');

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