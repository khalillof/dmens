"use strict";
const {UsersController} = require('../controllers/users.controller');
const {DefaultRoutesConfig } = require('./default.routes.config');
const {AuthService} = require('../auth/services/auth.service')

 async function UsersRoutes(app){
    return await DefaultRoutesConfig.instance(app,'/users', await UsersController.createInstance(), function(self){

            self.app.post('/users/signup',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields,
                //self.UsersMWare.validateSameEmailDoesntExist(self.controller),
                self.controller.signup(self.controller)
                );
            
            self.app.post('/users/login',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields,
                self.controller.login
                );

            self.app.get('/users/logout',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields,
                self.controller.logout
                );

                self.app.get('/users/profile',
                self.corsWithOption,
                AuthService.authenticateUser,
                self.controller.profile(self.controller));

            self.app.get('/facebook/token',
                    self.corsWithOption,
                    AuthService.authenticateFacebook,
                    self.controller.facebook);

            self.app.get('/users',
                   self.cors,self.corsWithOption, 
                   self.UsersMWare.verifyUser,
                   self.UsersMWare.verifyUserIsAdmin,
                self.controller.ToList(self.controller)); 

            self.app.get('/users/checkJWTtoken',
            self.corsWithOption,
            self.controller.checkJWTtoken
            );

            self.app.param('id', self.UsersMWare.extractUserId);
           
            self.app.all('/users/id',self.UsersMWare.validateUserExists(self.UsersMWare.controller));
            self.app.get('/users/id',self.corsWithOption, self.controller.getById(self.controller));
            self.app.delete('/users/id',self.corsWithOption,self.controller.remove(self.controller));

            self.app.post('/users/',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields,
                self.controller.create(self.controller));

            self.app.put('/users/',
                    self.corsWithOption,
                    self.UsersMWare.validateRequiredUserBodyFields,
                    self.UsersMWare.validateSameEmailBelongToSameUser(self.UsersMWare.controller),
                self.controller.put(self.controller));

            self.app.patch('/users',
            self.corsWithOption,
            self.UsersMWare.validatePatchEmail(self.UsersMWare.controller),
            self.controller.patch(self.controller));   
    })
}

exports.UsersRoutes = UsersRoutes;