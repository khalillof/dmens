"use strict";
const {printRoutesToString} = require('../../common/customTypes/types.config');
const { DefaultRoutesConfig} = require('./default.routes.config');
const { AuthRoutes} = require('./auth.routes.config');
const { UsersRoutes } = require('./users.routes.config');

exports.initCustomRoutes = async (callback) => {
    await DefaultRoutesConfig.createInstancesWithDefault().then(async ()=>{
    await UsersRoutes().then(async () => {
        await AuthRoutes().then(()=>{
            if (typeof callback === 'function') {
                callback()
            }
            // print routes 
            printRoutesToString()
        });
    })  
});
}
