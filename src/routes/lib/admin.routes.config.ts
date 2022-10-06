import express from 'express'
import {AdminController} from '../../controllers/index.js';
import {DefaultRoutesConfig} from './default.routes.config.js'
import { dbStore} from '../../common/index.js';
import {uploadSchema} from './uploads.js';
import { IDefaultRoutesConfig} from '../../interfaces/index.js';

export async function AdminRoutes(app:express.Application){
    
    return dbStore['account'] ? await Promise.resolve( await DefaultRoutesConfig.instance(app,'admin', await AdminController.createInstance('admin'), 
    (self:IDefaultRoutesConfig):void=>{

 self.defaultRoutes()
 self.buidRoute(self.routeName,'post','post',null,[uploadSchema])
 //self.post([uploadSchema]);
})) : console.log('Account model is not avaliable in dbStore No Schema routes configuered');;
};

