"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRoutesConfig = void 0;
const tslib_1 = require("tslib");
const cors_config_1 = require("./cors.config");
const types_config_1 = require("../common/customTypes/types.config");
const users_middleware_1 = (0, tslib_1.__importDefault)(require("../users/middleware/users.middleware"));
const default_controller_1 = require("../controllers/default.controller");
class DefaultRoutesConfig {
    constructor(exp, rName, control, callback) {
        this.app = exp;
        this.routeName = rName;
        this.routeParam = this.routeName + '/:id';
        this.cors = cors_config_1.corss;
        this.corsWithOption = cors_config_1.corsWithOptions;
        this.UsersMWare = new users_middleware_1.default();
        this.controller = typeof control === 'undefined' ? null : control;
        typeof callback === 'function' ? callback(this) : this.configureRoutes();
        // add instance to routeStore
        types_config_1.routeStore[this.routeName] = this;
        console.log('Added to routeStore :' + this.routeName);
    }
    static instance(exp, rName, control, callback) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var result = new DefaultRoutesConfig(exp, rName, control, callback);
            return yield Promise.resolve(result);
        });
    }
    static createInstancesWithDefault(exp, routeNames) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (routeNames && (routeNames === null || routeNames === void 0 ? void 0 : routeNames.length) > 0) {
                routeNames.forEach((name) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () { return yield DefaultRoutesConfig.instance(exp, name, yield default_controller_1.DefaultController.createInstance(name)); }));
            }
            else {
                throw new Error('at least one route name expected');
            }
        });
    }
    getName() {
        return this.routeName;
    }
    configureRoutes() {
        //this.app.route(item).options(this.corsWithOption, (req, res) => { res.sendStatus(200); } )
        //this.app.route(item)
        this.app.get(this.routeName, this.cors, this.controller.ToList);
        this.app.get(this.routeParam, this.cors, this.controller.getById);
        this.app.post(this.routeName, this.corsWithOption, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.controller.create);
        this.app.put(this.routeName, this.corsWithOption, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.controller.put);
        this.app.patch(this.routeName, this.corsWithOption, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.controller.patch);
        this.app.delete(this.routeParam, this.corsWithOption, this.UsersMWare.verifyUser, this.UsersMWare.verifyUserIsAdmin, this.controller.remove);
        //this.app.route(this.routename +'/id').get(this.corsWithOption,this.controller.getById);
    }
}
exports.DefaultRoutesConfig = DefaultRoutesConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5yb3V0ZXMuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcy9kZWZhdWx0LnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLCtDQUFxRDtBQUNyRCxxRUFBNkQ7QUFDN0QseUdBQW1FO0FBQ25FLDBFQUFzRTtBQUd0RSxNQUFhLG1CQUFtQjtJQVM1QixZQUFZLEdBQXdCLEVBQUUsS0FBYSxFQUFFLE9BQXVCLEVBQUUsUUFBYTtRQUN2RixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxtQkFBSyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxjQUFjLEdBQUcsNkJBQWUsQ0FBQztRQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFJLElBQUksMEJBQWUsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUVsRSxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXhFLDZCQUE2QjtRQUM3Qix5QkFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBQyxJQUFJLENBQUM7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7SUFFdkQsQ0FBQztJQUVBLE1BQU0sQ0FBTyxRQUFRLENBQUMsR0FBd0IsRUFBRSxLQUFhLEVBQUUsT0FBVyxFQUFFLFFB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