import express from 'express';
import {AuthController} from '../controllers/auth.controller';
import {AuthMiddleware} from '../auth/middlewares/auth.middleware';
import {JwtMiddleware} from '../auth/middlewares/jwt.middleware';
import {returnJson} from "../common/customTypes/types.config";
import {DefaultRoutesConfig} from './default.routes.config'
//app, '/auth',  AuthController
export function AuthRoutes(app: express.Application):DefaultRoutesConfig{
    return new DefaultRoutesConfig(app,'/auth', new AuthController(), function(self:DefaultRoutesConfig):void{

            const authMiddleware = AuthMiddleware.getInstance();
            const jwtMiddleware = JwtMiddleware.getInstance();
    
            self.app.route('/auth').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            .post(
                self.corsWithOption,
                authMiddleware.validateBodyRequest,
                authMiddleware.verifyUserPassword,
               self.controller.createJWT
            ).get(self.corsWithOption, (req, res, next) => {
                returnJson({message:'operation not supported '},403,res);
            })
            .put(self.corsWithOption,(req, res, next) => {
                returnJson({message:'operation not supported '},403,res);
            })
            .delete(self.corsWithOption, (req, res, next) => {
                returnJson({message:'operation not supported '},403,res);
            });
    
            self.app.route('/auth/refresh-token').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            .post(
                self.corsWithOption,
                jwtMiddleware.validJWTNeeded,
                jwtMiddleware.verifyRefreshBodyField,
                jwtMiddleware.validRefreshNeeded,
                self.controller.createJWT
            ).get(self.corsWithOption, (req, res, next) => {
                returnJson({message:'operation not supported '},403,res);
            })
            .put(self.corsWithOption,(req, res, next) => {
                returnJson({message:'operation not supported '},403,res);
            })
            .delete(self.corsWithOption, (req, res, next) => {
                returnJson({message:'operation not supported '},403,res);
            });
        });
};
