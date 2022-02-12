"use strict";

const path = require('path');

const {DefaultRoutesConfig} = require('./default.routes.config');

 async function IndexRoutes(app){
    return await DefaultRoutesConfig.instance(app,'/', null, (self)=>{

        self.app.get('/',(req, res, next)=>{
            
            res.status(200).sendFile(path.join(__dirname, '../../public/coming_soon/index.html'));
        });

        self.app.get('/angular',(req, res, next)=>{
            res.status(200).sendFile(path.join(__dirname, '../../public/angular/index.html'));
        });
        
        self.app.get('/reactjs',(req, res, next)=>{
            res.status(200).sendFile(path.join(__dirname, '../../public/reactjs/index.html'));
        });
    });
}

exports.IndexRoutes = IndexRoutes;