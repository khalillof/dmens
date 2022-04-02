import express from 'express'
import {AdminController} from '../../controllers';
import {DefaultRoutesConfig} from './default.routes.config'
import { dbStore} from '../../common';
import {uploadSchema} from './uploads';
import { IDefaultRoutesConfig} from '../../interfaces';

export async function AdminRoutes(app:express.Application){
    
    return dbStore['account'] ? await Promise.resolve( await DefaultRoutesConfig.instance(app,'admin', await AdminController.createInstance('admin'), 
    (self:IDefaultRoutesConfig):void=>{

 self.post([uploadSchema], true);
 self.getId();
 self.getList();
 self.put();
 self.delete();
 self.param()
})) : console.log('Account model is not avaliable in dbStore No Schema routes configuered');;
};

