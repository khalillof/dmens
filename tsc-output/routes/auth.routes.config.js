"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const tslib_1 = require("tslib");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../auth/middlewares/auth.middleware");
const jwt_middleware_1 = require("../auth/middlewares/jwt.middleware");
const default_routes_config_1 = require("./default.routes.config");
//app, '/auth',  AuthController
function AuthRoutes(app) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const authMWare = yield auth_middleware_1.AuthMiddleware.getInstance();
        const jwtMWare = yield jwt_middleware_1.JwtMiddleware.getInstance();
        return yield default_routes_config_1.DefaultRoutesConfig.instance(app, '/auth', yield auth_controller_1.AuthController.createInstance(), function (self) {
            // self.app.route('/auth').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/auth', self.corsWithOption, authMWare.validateBodyRequest, authMWare.verifyUserPassword, self.controller.createJWT);
            //self.app.route('/auth/refresh-token').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/auth/refresh-token', self.corsWithOption, jwtMWare.validJWTNeeded, jwtMWare.verifyRefreshBodyField, jwtMWare.validRefreshNeeded, self.controller.createJWT);
        });
    });
}
exports.AuthRoutes = AuthRoutes;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5yb3V0ZXMuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vcHVyZXRzL3JvdXRlcy9hdXRoLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLG9FQUE4RDtBQUM5RCx5RUFBbUU7QUFDbkUsdUVBQWlFO0FBQ2pFLG1FQUEyRDtBQUMzRCwrQkFBK0I7QUFDL0IsU0FBc0IsVUFBVSxDQUFDLEdBQXdCOztRQUVyRCxNQUFNLFNBQVMsR0FBRyxNQUFNLGdDQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckQsTUFBTSxRQUFRLEdBQUcsTUFBTSw4QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25ELE9BQU8sTUFBTSwyQ0FBbUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxNQUFNLGdDQUFjLENBQUMsY0FBYyxFQUFFLEVBQUUsVUFBUyxJQUF3QjtZQUV4SCxnR0FBZ0c7WUFDaEcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUNoQixJQUFJLENBQUMsY0FBYyxFQUNuQixTQUFTLENBQUMsbUJBQW1CLEVBQzdCLFNBQVMsQ0FBQyxrQkFBa0IsRUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQzVCLENBQUM7WUFFRiw2R0FBNkc7WUFDN0csSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQy9CLElBQUksQ0FBQyxjQUFjLEVBQ25CLFFBQVEsQ0FBQyxjQUFjLEVBQ3ZCLFFBQVEsQ0FBQyxzQkFBc0IsRUFDL0IsUUFBUSxDQUFDLGtCQUFrQixFQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDNUIsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztDQUFBO0FBdkJELGdDQXVCQztBQUFBLENBQUMifQ==