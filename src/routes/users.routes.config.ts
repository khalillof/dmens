
import UsersMiddleware from '../users/middleware/users.middleware';
import express from 'express';
import {UsersController}  from '../controllers/users.controller';
import {DefaultRoutesConfig } from './default.routes.config'
var passport = require('passport');

export function UsersRoutes(app: express.Application):DefaultRoutesConfig{
    return new  DefaultRoutesConfig(app,'/users', new UsersController(), function(self:DefaultRoutesConfig):void {

            self.app.route('/users/signup').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            .post(
                self.corsWithOption,
                UsersMiddleware.validateRequiredUserBodyFields,
                UsersMiddleware.validateSameEmailDoesntExist,
                self.controller.signup
                );
            
            self.app.route('/users/login').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
               .post(
                self.corsWithOption,
                UsersMiddleware.validateRequiredUserBodyFields,
                UsersMiddleware.validateUserExists,
                UsersMiddleware.verifyUserPassword,
                self.controller.login
                );

            self.app.route('/users/logout').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
                .get(
                self.corsWithOption,
                UsersMiddleware.validateRequiredUserBodyFields,
                UsersMiddleware.validateUserExists,
                self.controller.logout);

            self.app.route('/facebook/token').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
                .get(
                    self.corsWithOption,
                    passport.authenticate('facebook-token'),
                    self.controller.facebook);

            self.app.route('/users').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
                .get(
                   self.cors,self.corsWithOption, 
                   UsersMiddleware.verifyUser,
                   UsersMiddleware.verifyUserIsAdmin,
                self.controller.ToList); 
            self.app.route('/users/checkJWTtoken').get( self.corsWithOption,self.controller.checkJWTtoken );

            self.app.param('id', UsersMiddleware.extractUserId);
           
            self.app.route(`/users/id`).options(
                self.corsWithOption, 
                (req, res) => { res.sendStatus(200); } )
                .all(UsersMiddleware.validateUserExists)
                .get(
                    self.corsWithOption, 
                    self.controller.getById)
                .delete(
                    self.corsWithOption,
                    self.controller.remove)
                .put(
                    self.corsWithOption,
                UsersMiddleware.validateRequiredUserBodyFields,
                UsersMiddleware.validateSameEmailBelongToSameUser,
                self.controller.put)
                .patch(
                    self.corsWithOption,
                UsersMiddleware.validatePatchEmail,
                self.controller.patch
            );   
    })
}