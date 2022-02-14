"use strict";
const  {initCustomRoutes} = require('../../corejs/routes/init.routes.config');
const path = require('path');
const { appRouter} = require('../../corejs/common/customTypes/types.config');


function IndexRoutes() {
    appRouter.get('/', (req, res, next) => {

        res.status(200).sendFile(path.join(__dirname, '../../public/coming_soon/index.html'));
    });

    appRouter.get('/angular', (req, res, next) => {
        res.status(200).sendFile(path.join(__dirname, '../../public/angular/index.html'));
    });

    appRouter.get('/reactjs', (req, res, next) => {
        res.status(200).sendFile(path.join(__dirname, '../../public/reactjs/index.html'));
    });
}

exports.initClientRoutes = async ()=>{
 return await  initCustomRoutes(IndexRoutes)
}