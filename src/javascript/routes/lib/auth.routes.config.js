"use strict";
const { DefaultRoutesConfig} = require('./default.routes.config');
const {AuthController} = require('../../controllers')

async function AuthRoutes(exps) {

    // add routes
    return await Promise.resolve( DefaultRoutesConfig.instance(exps,'/auth', await AuthController.createInstance('account'),
        function () {
           let self=this;
            self.app.all('/auth',self.corsWithOption);

            self.app.post('/auth/refresh-token',
                self.actions('createAccessTokenBaseOnRefershToken')
            );
        }))

};

exports.AuthRoutes = AuthRoutes;