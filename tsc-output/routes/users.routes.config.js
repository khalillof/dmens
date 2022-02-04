"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const tslib_1 = require("tslib");
const users_controller_1 = require("../controllers/users.controller");
const default_routes_config_1 = require("./default.routes.config");
var passport = require('passport');
function UsersRoutes(app) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        return yield default_routes_config_1.DefaultRoutesConfig.instance(app, '/users', yield users_controller_1.UsersController.createInstance(), function (self) {
            //console.log('============ Users Routes Config =============')
            // self.app.route('/users/signup').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/users/signup', self.corsWithOption, self.UsersMWare.validateRequiredUserBodyFields, self.UsersMWare.validateSameEmailDoesntExist, self.controller.signup);
            //self.app.route('/users/login').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.post('/users/login', self.corsWithOption, self.UsersMWare.validateRequiredUserBodyFields, self.UsersMWare.validateUserExists, self.UsersMWare.verifyUserPassword, self.controller.login);
            // self.app.route('/users/logout').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.get('/users/logout', self.corsWithOption, self.UsersMWare.validateRequiredUserBodyFields, self.UsersMWare.validateUserExists, self.controller.logout);
            // self.app.route('/facebook/token').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.get('/facebook/token', self.corsWithOption, passport.authenticate('facebook-token'), self.controller.facebook);
            //self.app.route('/users').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.get('/users', self.cors, self.corsWithOption, self.UsersMWare.verifyUser, self.UsersMWare.verifyUserIsAdmin, self.controller.ToList);
            self.app.get('/users/checkJWTtoken', self.corsWithOption, self.controller.checkJWTtoken);
            self.app.param('id', self.UsersMWare.extractUserId);
            //self.app.route('/users/id').options(self.corsWithOption, (req, res) => { res.sendStatus(200); } )
            self.app.all('/users/id', self.UsersMWare.validateUserExists);
            self.app.get('/users/id', self.corsWithOption, self.controller.getById);
            self.app.delete('/users/id', self.corsWithOption, self.controller.remove);
            self.app.put('/users/', self.corsWithOption, self.UsersMWare.validateRequiredUserBodyFields, self.controller.create);
            self.app.put('/users/', self.corsWithOption, self.UsersMWare.validateRequiredUserBodyFields, self.UsersMWare.validateSameEmailBelongToSameUser, self.controller.put);
            self.app.patch('/users', self.corsWithOption, self.UsersMWare.validatePatchEmail, self.controller.patch);
        });
    });
}
exports.UsersRoutes = UsersRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMucm91dGVzLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3B1cmV0cy9yb3V0ZXMvdXNlcnMucm91dGVzLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsc0VBQWlFO0FBQ2pFLG1FQUE0RDtBQUM1RCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFbkMsU0FBc0IsV0FBVyxDQUFDLEdBQXdCOztRQUN0RCxPQUFPLE1BQU0sMkNBQW1CLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUUsTUFBTSxrQ0FBZSxDQUFDLGNBQWMsRUFBRSxFQUFFLFVBQVMsSUFBd0I7WUFDN0gsK0RBQStEO1lBQzVELHdHQUF3RztZQUN2RyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQ3pCLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsOEJBQThCLEVBQzlDLElBQUksQ0FBQyxVQUFVLENBQUMsNEJBQTRCLEVBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUNyQixDQUFDO1lBRU4sc0dBQXNHO1lBQ3RHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFDeEIsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsRUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQ3BCLENBQUM7WUFFUCx3R0FBd0c7WUFDdkcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUN4QixJQUFJLENBQUMsY0FBYyxFQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLDhCQUE4QixFQUM5QyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTdCLDBHQUEwRztZQUN6RyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFDdEIsSUFBSSxDQUFDLGNBQWMsRUFDbkIsUUFBUSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWxDLGdHQUFnRztZQUNoRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQ2QsSUFBSSxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsY0FBYyxFQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBQyxJQUFJLENBQUMsY0FBYyxFQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFFLENBQUM7WUFFeEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFcEQsbUdBQW1HO1lBQ25HLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUMsSUFBSSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXhFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFDbEIsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsRUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsRUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQ0FBaUMsRUFDckQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV6QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUMsSUFBSSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUcsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0NBQUE7QUE5REQsa0NBOERDIn0=