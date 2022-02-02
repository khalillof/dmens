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
        return yield default_routes_config_1.DefaultRoutesConfig.instance(app, '/auth', yield auth_controller_1.AuthController.createInstance(), function (self) {
            const authMWare = auth_middleware_1.AuthMiddleware.getInstance();
            const jwtMWare = jwt_middleware_1.JwtMiddleware.getInstance();
            // self.app.route('/auth').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/auth', self.corsWithOption, authMWare.validateBodyRequest, authMWare.verifyUserPassword, self.controller.createJWT);
            //self.app.route('/auth/refresh-token').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/auth/refresh-token', self.corsWithOption, jwtMWare.validJWTNeeded, jwtMWare.verifyRefreshBodyField, jwtMWare.validRefreshNeeded, self.controller.createJWT);
        });
    });
}
exports.AuthRoutes = AuthRoutes;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5yb3V0ZXMuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcy9hdXRoLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLG9FQUE4RDtBQUM5RCx5RUFBbUU7QUFDbkUsdUVBQWlFO0FBRWpFLG1FQUEyRDtBQUMzRCwrQkFBK0I7QUFDL0IsU0FBc0IsVUFBVSxDQUFDLEdBQXdCOztRQUNyRCxPQUFPLE1BQU0sMkNBQW1CLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUUsTUFBTSxnQ0FBYyxDQUFDLGNBQWMsRUFBRSxFQUFFLFVBQVMsSUFBd0I7WUFFM0gsTUFBTSxTQUFTLEdBQUcsZ0NBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMvQyxNQUFNLFFBQVEsR0FBSSw4QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRTNDLGdHQUFnRztZQUNoRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQ2hCLElBQUksQ0FBQyxjQUFjLEVBQ25CLFNBQVMsQ0FBQyxtQkFBbUIsRUFDN0IsU0FBUyxDQUFDLGtCQUFrQixFQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDNUIsQ0FBQztZQUVGLDZHQUE2RztZQUM3RyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFDL0IsSUFBSSxDQUFDLGNBQWMsRUFDbkIsUUFBUSxDQUFDLGNBQWMsRUFDdkIsUUFBUSxDQUFDLHNCQUFzQixFQUMvQixRQUFRLENBQUMsa0JBQWtCLEVBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUM1QixDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0NBQUE7QUF2QkQsZ0NBdUJDO0FBQUEsQ0FBQyJ9