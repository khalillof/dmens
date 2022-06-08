import express from 'express'
import {AuthController} from '../../controllers/index.js';
import {DefaultRoutesConfig} from './default.routes.config.js'
import { dbStore } from '../../common/index.js';
import { IDefaultRoutesConfig} from '../../interfaces/index.js';

export async function AuthRoutes(app:express.Application){
    
    return dbStore['account'] ? await Promise.resolve( await DefaultRoutesConfig.instance(app,'/auth', await AuthController.createInstance('account'), 
    function(self:IDefaultRoutesConfig):void{

        self.app.post('/auth/signup',self.mware!.validateRequiredUserBodyFields,self.actions('signup'));       
        self.app.post('/auth/signin',self.mware!.validateRequiredUserBodyFields,self.actions('signin'));
        self.app.get('/auth/logout',self.actions('logout'));
        self.app.get('/auth/facebook/token',self.authenticate('facebook'),self.actions('facebook'));

        self.options('/auth/signup')
        self.options('/auth/signin')
        self.options('/auth/logout')
        self.options('/auth/facebook/token')

        self.app.get('/auth/profile/:id',self.authenticate("jwt"),self.mware!.validateCurrentUserOwnParamId, self.actions('findById'));
        self.app.delete('/auth/profile/:id',self.authenticate("jwt"),self.mware!.validateCurrentUserOwnParamId,self.actions('remove'));
        self.app.put('/auth/profile/:id',self.authenticate("jwt"),self.mware!.validateCurrentUserOwnParamId,self.actions('put')); 
        self.param()
        // get profile require query string eg ==>  /auth/profile?email=user@user.co
        self.app.get('/auth/profile',self.authenticate("jwt"),self.mware!.validateHasQueryEmailBelongToCurrentUser, self.actions('profile'));
       
        self.options('/auth/profile')
        self.options('/auth/profile/:id')

})) : console.log('Account model is not avaliable in dbStore No Auth routes configuered');
};