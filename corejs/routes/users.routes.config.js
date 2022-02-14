"use strict";
const {UsersController} = require('../controllers/users.controller');
const {DefaultRoutesConfig } = require('../../corejs/routes/default.routes.config');
const {AuthService} = require('../auth/services/auth.service')

 async function UsersRoutes(){

 return await  DefaultRoutesConfig.instance('/users', await UsersController.createInstance(), 
    
   function(self){
              
        self.router.post('/users/signup',
            self.corsWithOption,
            self.UsersMWare.validateRequiredUserBodyFields,
            self.controller.signup(self.controller)
            );
        
        self.router.post('/users/login',
            self.corsWithOption,
            self.UsersMWare.validateRequiredUserBodyFields,
            self.controller.login(self.controller)
            );

        self.router.get('/users/logout',
            self.corsWithOption,
            self.UsersMWare.validateRequiredUserBodyFields,
            self.controller.logout
            );

            self.router.get('/users/profile',
            self.corsWithOption,
            AuthService.authenticateUser,
            self.controller.profile);

        self.router.get('/facebook/token',
                self.corsWithOption,
                AuthService.authenticateFacebook,
                self.controller.facebook);

        self.router.get('/users',
               self.cors,self.corsWithOption, 
               self.UsersMWare.verifyUser,
               self.UsersMWare.verifyUserIsAdmin,
            self.controller.ToList(self.controller)); 

        self.router.get('/users/checkJWTtoken',
        self.corsWithOption,
        self.controller.checkJWTtoken(self.controller)
        );

        self.router.param('id', self.UsersMWare.extractUserId);
       
        self.router.all('/users/id',self.UsersMWare.validateUserExists(self.UsersMWare.controller));
        self.router.get('/users/id',self.controller.getById(self.controller));
        self.router.delete('/users/id',self.controller.remove(self.controller));
        self.router.put('/users/id',
            self.UsersMWare.validateSameEmailBelongToSameUser(self.UsersMWare.controller),
            self.controller.put(self.controller)); 
});

}

exports.UsersRoutes = UsersRoutes;