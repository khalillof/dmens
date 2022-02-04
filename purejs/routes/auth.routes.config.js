"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const {AuthController }= require('../controllers/auth.controller');
const {AuthMiddleware} = require('../auth/middlewares/auth.middleware');
const {JwtMiddleware} = require('../auth/middlewares/jwt.middleware');
const {DefaultRoutesConfig} = require('./default.routes.config');

async function AuthRoutes(app){
    const authMWare = await AuthMiddleware.getInstance();
    const jwtMWare = await JwtMiddleware.getInstance();

    return await DefaultRoutesConfig.instance(app,'/auth', await AuthController.createInstance(), function(self){
           // self.app.route('/auth').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
           self.app.post('/auth',
                self.corsWithOption,
                authMWare.validateBodyRequest,
                authMWare.verifyUserPassword,
                self.controller.createJWT
            );
    
            //self.app.route('/auth/refresh-token').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/auth/refresh-token',
                self.corsWithOption,
                jwtMWare.validJWTNeeded,
                jwtMWare.verifyRefreshBodyField,
                jwtMWare.validRefreshNeeded,
                self.controller.createJWT
            );
        });
};

exports.AuthRoutes = AuthRoutes;