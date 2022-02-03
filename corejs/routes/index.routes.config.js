"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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

        /* 
        .delete(self.corsWithOption, (req, res, next) => {
            returnJson({message:'operation not supported '},403,res);
        });
        */
    });
}

exports.IndexRoutes = IndexRoutes;