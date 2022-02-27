"use strict";
const {UsersController} = require('../../controllers');
const {DefaultRoutesConfig } = require('./default.routes.config');
const {AuthService} = require('../../auth/services/auth.service');

 async function UsersRoutes(){

 return await  Promise.resolve(DefaultRoutesConfig.instance('/users', await UsersController.createInstance('user'), 
    
   (self)=>{
        self.router.all('/users',self.corsWithOption);
        self.router.post('/users/signup',
            self.UsersMWare.validateRequiredUserBodyFields,
            self.tryCatchAction('signup')
            );
        
        self.router.post('/users/login',
            self.UsersMWare.validateRequiredUserBodyFields,
            self.tryCatchAction('login')
            );

        self.router.get('/users/logout',self.actions('logout'));

        self.router.get('/users/profile',AuthService.authenticateUser,self.tryCatchAction('profile'));

        self.router.get('/facebook/token',AuthService.authenticateFacebook,self.tryCatchAction('facebook'));

        self.router.get('/users',self.UsersMWare.verifyUser,self.UsersMWare.verifyUserIsAdmin,self.actions('list')); 

        self.router.get('/users/checkJWTtoken',self.tryCatchAction('checkJWTtoken'));

        self.router.param('id', self.UsersMWare.extractUserId);
       
        self.router.all('/users/id',self.UsersMWare.validateUserExists);
        self.router.get('/users/id',self.tryCatchAction('getOneById'));
        self.router.delete('/users/id',self.tryCatchAction('remove'));
        self.router.put('/users/id',
            self.UsersMWare.validateSameEmailBelongToSameUser,
            self.tryCatchAction('put')); 
}));

}


exports.UsersRoutes = UsersRoutes;

