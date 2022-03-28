import express from 'express'
import {EditorController} from '../../controllers';
import {DefaultRoutesConfig} from './default.routes.config'
import { dbStore} from '../../common';
import {uploadSchema} from './uploads';
import { IDefaultRoutesConfig} from '../../interfaces';

export async function EditorRoutes(app:express.Application){
    
    return dbStore['account'] ? await Promise.resolve( await DefaultRoutesConfig.instance(app,'editor', await EditorController.createInstance('editor'), 
    (self:IDefaultRoutesConfig):void=>{

 self.post([uploadSchema], true);
 self.getId();
 self.getList();
 self.put();
 self.delete();
 self.param()
})) : console.log('Account model is not avaliable in dbStore No Schema routes configuered');;
};

