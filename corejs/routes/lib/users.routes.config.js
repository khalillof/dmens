"use strict";
const {UsersController} = require('../../controllers');
const {DefaultRoutesConfig } = require('./default.routes.config');
const {AuthService} = require('../../auth/services/auth.service');

 async function UsersRoutes(){

 return await  Promise.resolve(DefaultRoutesConfig.instance('user', await UsersController.createInstance('user'), 
    
   (self)=>{
        self.router.all('/users',self.corsWithOption);
        self.router.post('/users/signup',
            self.UsersMWare.validateRequiredUserBodyFields,
            self.actions('signup')
            );
        
        self.router.post('/users/login',
            self.UsersMWare.validateRequiredUserBodyFields,
            self.actions('login')
            );

        self.router.get('/users/logout',self.actions('logout'));

        self.router.get('/users/profile',AuthService.authenticateUser,self.actions('profile'));

        self.router.get('/facebook/token',AuthService.authenticateFacebook,self.actions('facebook'));

        self.router.get('/users',self.UsersMWare.userIsAuthenticated,self.UsersMWare.verifyUserIsAdmin,self.actions('list')); 

        self.router.get('/users/checkJWTtoken',self.actions('checkJWTtoken'));

        //self.router.param('id', self.UsersMWare.extractUserId);
       self.param()
        self.router.all('/users/id',self.UsersMWare.validateUserExists);
        self.router.get('/users/id',self.UsersMWare.userIsAuthenticated, self.UsersMWare.validateSameEmailBelongToSameUser,self.actions('getOneById'));
        self.router.delete('/users/id',self.UsersMWare.userIsAuthenticated, self.UsersMWare.verifyUserIsAdmin,self.actions('remove'));
        self.router.put('/users/id',
            self.UsersMWare.validateSameEmailBelongToSameUser,
            self.actions('put')); 
}));

}


exports.UsersRoutes = UsersRoutes;

