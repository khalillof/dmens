"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const tslib_1 = require("tslib");
const default_controller_1 = require("./default.controller");
const argon2_1 = (0, tslib_1.__importDefault)(require("argon2"));
const types_config_1 = require("../common/customTypes/types.config");
const passport_1 = (0, tslib_1.__importDefault)(require("passport"));
const jwt_service_1 = require("../auth/services/jwt.service");
class UsersController extends default_controller_1.DefaultController {
    constructor() {
        super('user');
    }
    static createInstance() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var result = new UsersController();
            if (!result.svc) {
                result.setDb('user');
            }
            return yield Promise.resolve(result);
        });
    }
    signup(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let db = (0, types_config_1.getCont)(req.url);
            req.body.password = yield argon2_1.default.hash(req.body.password);
            yield db.register({ username: req.body.username, email: req.body.email, password: req.body.password }, req.body.password, (err, user) => {
                if (err) {
                    (0, types_config_1.returnJson)({ err: err }, 500, res);
                }
                else {
                    if (req.body.firstname)
                        user.firstname = req.body.firstname;
                    if (req.body.lastname)
                        user.lastname = req.body.lastname;
                    user.save((err, user) => {
                        if (err) {
                            (0, types_config_1.returnJson)({ err: err }, 500, res);
                        }
                        passport_1.default.authenticate('local')(req, res, () => {
                            (0, types_config_1.returnJson)({ success: true, status: 'Registration Successful!' }, 204, res);
                        });
                    });
                }
            });
            ;
        });
    }
    login(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // let ddd :any =getCont('/users');
            passport_1.default.authenticate('local', (err, user, info) => {
                if (err)
                    next(err);
                if (!user)
                    (0, types_config_1.returnJson)({ success: false, status: 'Login Unsuccessful!', err: info }, 401, res);
                req.logIn(user, (err) => {
                    if (err) {
                        (0, types_config_1.returnJson)({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!' }, 401, res);
                    }
                    // var token = authenticate.getToken({_id: user._id});
                    var token = jwt_service_1.JwtService.generateToken({ _id: user._id });
                    (0, types_config_1.returnJson)(({ success: true, status: 'Login Successful!', token: token }), 200, res);
                });
            })(req, res, next);
        });
    }
    ;
    logout(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (req.session) {
                req.session.destroy();
                res.clearCookie('session-id');
                res.redirect('/');
            }
            else {
                (0, types_config_1.returnJson)({ err: "You are not logged in!" }, 403, res);
            }
        });
    }
    facebook(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (req.user) {
                var token = jwt_service_1.JwtService.generateToken({ _id: req.user._id });
                (0, types_config_1.returnJson)({ success: true, token: token, status: 'You are successfully logged in!' }, 204, res);
            }
        });
    }
    create(req, res, next) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            req.body.password = yield argon2_1.default.hash(req.body.password);
            yield _super.create.call(this, req, res, next);
        });
    }
    patch(req, res, next) {
        const _super = Object.create(null, {
            patch: { get: () => super.patch }
        });
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (req.body.password) {
                req.body.password = yield argon2_1.default.hash(req.body.password);
            }
            yield _super.patch.call(this, req, res, next);
        });
    }
    put(req, res, next) {
        const _super = Object.create(null, {
            put: { get: () => super.put }
        });
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            req.body.password = yield argon2_1.default.hash(req.body.password);
            yield _super.put.call(this, req, res, next);
        });
    }
    checkJWTtoken(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
                if (err)
                    next(err);
                if (!user) {
                    (0, types_config_1.returnJson)({ status: 'JWT invalid!', success: false, err: info }, 401, res);
                }
                else {
                    (0, types_config_1.returnJson)({ status: 'JWT valid!', success: true, user: user }, 200, res);
                }
            })(req, res, next);
        });
    }
    ;
    // helper
    getUserByEmail(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield types_config_1.dbStore['User'].findOne({ email: email });
        });
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3B1cmV0cy9jb250cm9sbGVycy91c2Vycy5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSw2REFBc0Q7QUFDdEQsaUVBQTRCO0FBQzVCLHFFQUErRTtBQUMvRSxxRUFBZ0M7QUFDaEMsOERBQXVEO0FBRXZELE1BQWEsZUFBZ0IsU0FBUSxzQ0FBaUI7SUFFcEQ7UUFDRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDakIsQ0FBQztJQUNNLE1BQU0sQ0FBTyxjQUFjOztZQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1lBQ25DLElBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFDO2dCQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDckI7WUFDSCxPQUFRLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxDQUFDO0tBQUE7SUFFUyxNQUFNLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQTBCOztZQUNoRixJQUFJLEVBQUUsR0FBSyxJQUFBLHNCQUFPLEVBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUxRCxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQyxFQUNuRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQU8s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