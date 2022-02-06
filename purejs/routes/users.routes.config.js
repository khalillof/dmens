"use strict";
const {UsersController} = require('../controllers/users.controller');
const {DefaultRoutesConfig } = require('./default.routes.config');
var passport = require('passport');

 async function UsersRoutes(app){
    return await DefaultRoutesConfig.instance(app,'/users', await UsersController.createInstance(), function(self){

            self.app.post('/users/signup',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields(self.UsersMWare),
                self.UsersMWare.validateSameEmailDoesntExist(self.UsersMWare),
                self.controller.signup(self.controller)
                );
            
            self.app.post('/users/login',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields(self.UsersMWare),
                self.UsersMWare.validateUserExists(self.UsersMWare),
                self.UsersMWare.verifyUserPassword(self.UsersMWare),
                self.controller.login(self.controller)
                );

            self.app.get('/users/logout',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields(self.UsersMWare),
                self.UsersMWare.validateUserExists(self.UsersMWare),
                self.controller.logout(self.controller));

            self.app.get('/facebook/token',
                    self.corsWithOption,
                    passport.authenticate('facebook-token'),
                    self.controller.facebook(self.controller));

            self.app.get('/users',
                   self.cors,self.corsWithOption, 
                   self.UsersMWare.verifyUser,
                   self.UsersMWare.verifyUserIsAdmin(self.UsersMWare),
                self.controller.ToList(self.controller)); 

            self.app.get('/users/checkJWTtoken',self.corsWithOption,self.controller.checkJWTtoken(self.controller) );

            self.app.param('id', self.UsersMWare.extractUserId);
           
            self.app.all('/users/id',self.UsersMWare.validateUserExists(self.UsersMWare));
            self.app.get('/users/id',self.corsWithOption, self.controller.getById(self.controller));
            self.app.delete('/users/id',self.corsWithOption,self.controller.remove(self.controller));

            self.app.post('/users/',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields(self.UsersMWare),
                self.controller.create(self.controller));

            self.app.put('/users/',
                    self.corsWithOption,
                    self.UsersMWare.validateRequiredUserBodyFields(self.UsersMWare),
                    self.UsersMWare.validateSameEmailBelongToSameUser(self.UsersMWare),
                self.controller.put(self.controller));

            self.app.patch('/users',self.corsWithOption,self.UsersMWare.validatePatchEmail(self.UsersMWare),self.controller.patch(self.controller));   
    })
}

exports.UsersRoutes = UsersRoutes;