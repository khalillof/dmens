"use strict";
const { DefaultRoutesConfig} = require('./default.routes.config');
const {AuthController} = require('../../controllers')
const { dbStore} =require('../../common');

async function AuthRoutes(exps) {

    // add routes
    return dbStore['account'] ? await Promise.resolve( DefaultRoutesConfig.instance(exps,'/auth', await AuthController.createInstance('account'),
        function () {
           let self=this;
            self.app.all('/auth',self.corsWithOption);

            self.app.post('/auth/refresh-token',
                self.actions('checkAccessRefershTokensAndCreate')
            );
        })): console.log('Account model is not avaliable in dbStore No Auth routes configuered');

}

exports.AuthRoutes = AuthRoutes;