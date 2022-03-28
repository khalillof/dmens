"use strict";
const {AccountsController} = require('../../controllers');
const {DefaultRoutesConfig } = require('./default.routes.config');

 async function AccountsRoutes(exp){


 return await  Promise.resolve(DefaultRoutesConfig.instance(exp,'account', await AccountsController.createInstance('account'), 
    
   function(){
       let self = this;
       
        self.app.all('/accounts',self.corsWithOption);
        self.app.post('/accounts/signup',
            self.mware.validateRequiredUserBodyFields,
            self.actions('signup')
            );
        

        self.app.post('/accounts/login',
            self.mware.validateRequiredUserBodyFields,
            self.actions('login')
            );

        self.app.get('/accounts/logout',self.actions('logout'));

        self.app.get('/accounts/profile',self.authenticate("jwt"),self.mware.validateSameEmailBelongToSameUser,self.actions('profile'));

        self.app.get('/facebook/token',self.authenticate('facebook'),self.actions('facebook'));

        self.app.get('/accounts',self.authenticate("jwt"),self.mware.isInRole('admin'),self.actions('list')); 

        //self.app.param('id', self.mware.extractUserId);
       self.param()
        self.app.all('/accounts/id',self.authenticate("jwt"));
        self.app.get('/accounts/id',self.mware.validateSameEmailBelongToSameUser,self.actions('getOneById'));
        self.app.delete('/accounts/id',self.mware.isInRole('admin'),self.actions('remove'));
        self.app.put('/accounts/id',
            self.mware.validateSameEmailBelongToSameUser,
            self.actions('put')); 
}));

}


exports.AccountsRoutes = AccountsRoutes;

