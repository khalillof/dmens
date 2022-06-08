import express from 'express'
import { DefaultController } from '../../controllers/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';
import { dbStore } from '../../common/index.js';
import { IDefaultRoutesConfig} from '../../interfaces/index.js';


export async function AccountsRoutes(app:express.Application) {
    return dbStore['account'] ? await Promise.resolve(await DefaultRoutesConfig.instance(app,'account', await DefaultController.createInstance('account'),
    (self:IDefaultRoutesConfig)=>{
        
        self.getList(null,true,true);
        self.getId(null,true,true);
        self.post(null, true, true);
        self.put(null,true,true);
        self.delete(null,true,true);
        self.param()
})): console.log('Account model is not avaliable in dbStore No accounts routes configuered');
}