"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const {UsersController} = require('../controllers/users.controller');
const {DefaultRoutesConfig } = require('./default.routes.config');
var passport = require('passport');

 async function UsersRoutes(app){
    return await DefaultRoutesConfig.instance(app,'/users', await UsersController.createInstance(), function(self){
        //console.log('============ Users Routes Config =============')
           // self.app.route('/users/signup').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/users/signup',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields,
                self.UsersMWare.validateSameEmailDoesntExist,
                self.controller.signup
                );
            
            //self.app.route('/users/login').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/users/login',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields,
                self.UsersMWare.validateUserExists,
                self.UsersMWare.verifyUserPassword,
                self.controller.login
                );

           // self.app.route('/users/logout').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.get('/users/logout',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields,
                self.UsersMWare.validateUserExists,
                self.controller.logout);

           // self.app.route('/facebook/token').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.get('/facebook/token',
                    self.corsWithOption,
                    passport.authenticate('facebook-token'),
                    self.controller.facebook);

            //self.app.route('/users').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.get('/users',
                   self.cors,self.corsWithOption, 
                   self.UsersMWare.verifyUser,
                   self.UsersMWare.verifyUserIsAdmin,
                self.controller.ToList); 

            self.app.get('/users/checkJWTtoken',self.corsWithOption,self.controller.checkJWTtoken );

            self.app.param('id', self.UsersMWare.extractUserId);
           
            //self.app.route('/users/id').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.all('/users/id',self.UsersMWare.validateUserExists);
            self.app.get('/users/id',self.corsWithOption, self.controller.getById);
            self.app.delete('/users/id',self.corsWithOption,self.controller.remove);

            self.app.put('/users/',
                self.corsWithOption,
                self.UsersMWare.validateRequiredUserBodyFields,
                self.controller.create);

            self.app.put('/users/',
                    self.corsWithOption,
                    self.UsersMWare.validateRequiredUserBodyFields,
                    self.UsersMWare.validateSameEmailBelongToSameUser,
                self.controller.put);

            self.app.patch('/users',self.corsWithOption,self.UsersMWare.validatePatchEmail,self.controller.patch);   
    })
}

exports.UsersRoutes = UsersRoutes;