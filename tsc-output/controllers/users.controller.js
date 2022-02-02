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
    constructor(svc) {
        super(svc);
    }
    static createInstance() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var result = new UsersController((0, types_config_1.getSvc)('/users'));
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
            return yield (0, types_config_1.getSvc)('/users').db.findOne({ email: email });
        });
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy91c2Vycy5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSw2REFBc0Q7QUFDdEQsaUVBQTRCO0FBQzVCLHFFQUE4RTtBQUM5RSxxRUFBZ0M7QUFDaEMsOERBQXVEO0FBR3ZELE1BQWEsZUFBZ0IsU0FBUSxzQ0FBaUI7SUFFcEQsWUFBWSxHQUFRO1FBQ2xCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNkLENBQUM7SUFDTSxNQUFNLENBQU8sY0FBYzs7WUFDOUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBQSxxQkFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDckQsT0FBUSxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBRVMsTUFBTSxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUEwQjs7WUFDaEYsSUFBSSxFQUFFLEdBQUssSUFBQSxzQkFBTyxFQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLGdCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFMUQsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsRUFDbkcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFPLEVBQUUsSUFBUSxFQUFFLEVBQUU7Z0JBRXhDLElBQUksR0FBRyxFQUFFO29C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