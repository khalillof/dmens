"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_config_1 = require("../../common/customTypes/types.config");
const jwt_service_1 = require("../../auth/services/jwt.service");
const argon2_1 = (0, tslib_1.__importDefault)(require("argon2"));
class UsersMiddleware {
    constructor() {
        this.verifyUser = new jwt_service_1.JwtService().verifyUser;
    }
    static createInstance() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let usm = new UsersMiddleware();
            return yield Promise.resolve(usm);
        });
    }
    validateRequiredUserBodyFields(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (req.body && req.body.email && req.body.password) {
                next();
            }
            else {
                (0, types_config_1.returnJson)({ error: 'Missing body fields: email, password' }, 400, res);
            }
        });
    }
    verifyUserPassword(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let db = (0, types_config_1.getCont)('/users');
            yield db.getUserByEmail(req.body.email).then((user) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                if (user) {
                    let passwordHash = user.password;
                    if (yield argon2_1.default.verify(passwordHash, req.body.password)) {
                        req.body.password = passwordHash;
                        req.body._id = user._d;
                        //req.user = user;
                        //req.body = {
                        //    userId: user._id,
                        //    email: user.email,
                        //    provider: 'email',
                        //    password: passwordHash
                        //permissionLevel: user.permissionLevel,
                        //};
                        next();
                    }
                    else {
                        (0, types_config_1.returnJson)({ error: 'Invalid e-mail and/or password' }, 400, res);
                    }
                }
                else {
                    (0, types_config_1.returnJson)({ error: 'Invalid e-mail and/or password' }, 400, res);
                }
            })).catch((err) => next(err));
        });
    }
    validateSameEmailDoesntExist(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let db = (0, types_config_1.getCont)('/users');
            yield db.getUserByEmail(req.body.email).then((user) => {
                user ? (0, types_config_1.returnJson)({ error: `User email already exists` }, 400, res) : next();
            }).catch((err) => {
                console.error(err);
                next(err);
            });
        });
    }
    validateSameEmailBelongToSameUser(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let db = (0, types_config_1.getCont)('/users');
            const user = yield db.getUserByEmail(req.body.email);
            if (user && user.id === req.params.userId) {
                next();
            }
            else {
                (0, types_config_1.returnJson)({ error: `Invalid email` }, 400, res);
            }
        });
    }
    // Here we need to use an arrow function to bind `this` correctly
    validatePatchEmail(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (req.body.email) {
                this.validateSameEmailBelongToSameUser(req, res, next);
            }
            else {
                next();
            }
        });
    }
    validateUserExists(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let db = (0, types_config_1.getCont)('/users');
            yield db.getUserByEmail(req.body.email).then((user) => {
                user ? next() : (0, types_config_1.returnJson)({ error: 'User ${req.body.email' }, 404, res);
            }).catch((err) => next(err));
        });
    }
    verifyUserIsAdmin(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (req.user.admin || req.body.comment) {
                next();
            }
            else {
                (0, types_config_1.returnJson)({ error: 'you are not authorized' }, 401, res);
            }
        });
    }
    extractUserId(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            req.body.id = req.params.id;
            next();
        });
    }
}
exports.default = UsersMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91c2Vycy9taWRkbGV3YXJlL3VzZXJzLm1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0VBQXlGO0FBQ3pGLGlFQUEwRDtBQUMxRCxpRUFBNEI7QUFDNUIsTUFBTSxlQUFlO0lBQXJCO1FBTUksZUFBVSxHQUFTLElBQUksd0JBQVUsRUFBRSxDQUFDLFVBQVUsQ0FBQztJQXNGbkQsQ0FBQztJQTFGRyxNQUFNLENBQU8sY0FBYzs7WUFDdkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQTtZQUMvQixPQUFPLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNyQyxDQUFDO0tBQUE7SUFHSyw4QkFBOEIsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBMEI7O1lBQ3hHLElBQUcsR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQztnQkFDL0MsSUFBSSxFQUFFLENBQUM7YUFDVjtpQkFBSTtnQkFDRCxJQUFBLHlCQUFVLEVBQUMsRUFBQyxLQUFLLEVBQUUsc0NBQXNDLEVBQUMsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7YUFDeEU7UUFDTCxDQUFDO0tBQUE7SUFFSyxrQkFBa0IsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBMEI7O1lBQzdGLElBQUksRUFBRSxHQUFPLElBQUEsc0JBQU8sRUFBQyxRQUFRLENBQUMsQ0FBQztZQUM5QixNQUFNLEVBQUUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBTyxJQUFRLEVBQUMsRUFBRTtnQkFDL0QsSUFBSSxJQUFJLEVBQUU7b0JBQ04sSUFBSSxZQUFZLEdB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