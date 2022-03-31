import express from 'express'
import {AuthController} from '../../controllers';
import {DefaultRoutesConfig} from './default.routes.config'
import { dbStore } from '../../common';
import { IDefaultRoutesConfig} from '../../interfaces';

export async function AuthRoutes(app:express.Application){
    
    return dbStore['account'] ? await Promise.resolve( await DefaultRoutesConfig.instance(app,'/auth', await AuthController.createInstance('account'), 
    function(self:IDefaultRoutesConfig):void{

        self.app.all('/auth',self.corsWithOption);

        self.app.post('/auth/refresh-token',
        self.actions('checkAccessRefershTokensAndCreate')
        );
})) : console.log('Account model is not avaliable in dbStore No Auth routes configuered');;
};