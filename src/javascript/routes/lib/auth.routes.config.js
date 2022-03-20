"use strict";
const { DefaultRoutesConfig} = require('./default.routes.config');
const {AuthController} = require('../../controllers')

async function AuthRoutes() {

    // add routes
    return await Promise.resolve( DefaultRoutesConfig.instance('/auth', await AuthController.createInstance('account'),
        function () {
           let self=this;
            self.router.all('/auth',self.corsWithOption);
            self.router.post('/auth',
                self.mWares.validateRequiredUserBodyFields,
                self.controller.createJWT
            );

            self.router.post('/auth/refresh-token',
                self.controller.createJWT
            );
        }))

};

exports.AuthRoutes = AuthRoutes;