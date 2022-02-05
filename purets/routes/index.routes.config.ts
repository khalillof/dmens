
import express from 'express';
import path from 'path';
//import {returnJson} from "../common/customTypes/types.config";

import {DefaultRoutesConfig} from './default.routes.config';

export async function IndexRoutes(app: express.Application){
    return await DefaultRoutesConfig.instance(app,'/', null, (self:DefaultRoutesConfig):void =>{

        self.app.get('/',(req: express.Request, res: express.Response, next: express.NextFunction)=>{
            
            res.status(200).sendFile(path.join(__dirname, '../../public/coming_soon/index.html'));
        });

        self.app.get('/angular',(req: express.Request, res: express.Response, next: express.NextFunction)=>{
            res.status(200).sendFile(path.join(__dirname, '../../public/angular/index.html'));
        });
        
        self.app.get('/reactjs',(req: express.Request, res: express.Response, next: express.NextFunction)=>{
            res.status(200).sendFile(path.join(__dirname, '../../public/reactjs/index.html'));
        });

        /* 
        .post(self.corsWithOption, (req, res, next) => {
            returnJson({message:'operation not supported '},403,res);
        })
        .put(self.corsWithOption,(req, res, next) => {
            returnJson({message:'operation not supported '},403,res);
        })
        .delete(self.corsWithOption, (req, res, next) => {
            returnJson({message:'operation not supported '},403,res);
        });
        */
    });
}