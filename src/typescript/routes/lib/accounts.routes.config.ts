import express from 'express'
import { AccountsController } from '../../controllers';
import { DefaultRoutesConfig } from './default.routes.config';
import { dbStore } from '../../common';
import { IDefaultRoutesConfig} from '../../interfaces';


export async function AccountsRoutes(app:express.Application) {
    return dbStore['account'] ? await Promise.resolve(await DefaultRoutesConfig.instance(app,'account', await AccountsController.createInstance('account'),
    (self:IDefaultRoutesConfig)=>{

        self.app.all('/accounts',self.corsWithOption);
        self.app.post('/accounts/signup',
            self.mware!.validateRequiredUserBodyFields,
            self.actions('signup')
            );
        

        self.app.post('/accounts/login',
            self.mware!.validateRequiredUserBodyFields,
            self.actions('login')
            );

        self.app.get('/accounts/logout',self.actions('logout'));

        self.app.get('/accounts/profile',self.authenticate("jwt"),self.mware!.validateSameEmailBelongToSameUser,self.actions('profile'));

        self.app.get('/facebook/token',self.authenticate('facebook'),self.actions('facebook'));

        self.app.get('/accounts',self.authenticate("jwt"),self.mware!.isInRole('admin'),self.actions('list')); 

        //self.app.param('id', self.mware.extractUserId);
       self.param()
        self.app.all('/accounts/id',self.authenticate("jwt"));
        self.app.get('/accounts/id',self.mware!.validateSameEmailBelongToSameUser,self.actions('getOneById'));
        self.app.delete('/accounts/id',self.mware!.isInRole('admin'),self.actions('remove'));
        self.app.put('/accounts/id',
            self.mware!.validateSameEmailBelongToSameUser,
            self.actions('put')); 
})): console.log('Account model is not avaliable in dbStore No accounts routes configuered');
}