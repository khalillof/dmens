"use strict";
const { appRouter, printRoutesToString } = require('../common/customTypes/types.config');
const { AuthRoutes } = require('./auth.routes.config');
const { UsersRoutes } = require('./users.routes.config');

exports.initCustomRoutes = async (callback) => {
    // index routes
    //IndexRoutes();

    await UsersRoutes().then(async () => {
        await AuthRoutes().then(()=>{
            if (typeof callback === 'function') {
                callback()
            }
            // print routes 
            printRoutesToString()
        });
    })
}
