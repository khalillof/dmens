"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const tslib_1 = require("tslib");
const argon2_1 = (0, tslib_1.__importDefault)(require("argon2"));
const types_config_1 = require("../../common/customTypes/types.config");
class AuthMiddleware {
    static getInstance() {
        if (!AuthMiddleware.instance) {
            AuthMiddleware.instance = new AuthMiddleware();
        }
        return AuthMiddleware.instance;
    }
    validateBodyRequest(req, res, next) {
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
                        req.body = {
                            userId: user._id,
                            email: user.email,
                            provider: 'email',
                            password: passwordHash
                            //permissionLevel: user.permissionLevel,
                        };
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
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHVyZXRzL2F1dGgvbWlkZGxld2FyZXMvYXV0aC5taWRkbGV3YXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxpRUFBNEI7QUFDNUIsd0VBQXlFO0FBRXpFLE1BQWEsY0FBYztJQUV2QixNQUFNLENBQUMsV0FBVztRQUNkLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFO1lBQzFCLGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztTQUNsRDtRQUNELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0lBRUssbUJBQW1CLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQTBCOztZQUM3RixJQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUM7Z0JBQy9DLElBQUksRUFBRSxDQUFDO2FBQ1Y7aUJBQUk7Z0JBQ0QsSUFBQSx5QkFBVSxFQUFDLEVBQUMsS0FBSyxFQUFFLHNDQUFzQyxFQUFDLEVBQUUsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3hFO1FBQ0wsQ0FBQztLQUFBO0lBRUssa0JBQWtCLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQTBCOztZQUM3RixJQUFJLEVBQUUsR0FBTyxJQUFBLHNCQUFPLEVBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsTUFBTSxFQUFFLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQU8sSUFBUSxFQUFDLEVBQUU7Z0JBQy9ELElBQUksSUFBSSxFQUFFO29CQUNOLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ2pDLElBQUksTUFBTSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDdEQsR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDUCxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUc7NEJBQ2hCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSzs0QkFDakIsUUFBUSxFQUFFLE9BQU87NEJBQ2pCLFFBQVEsRUFBRSxZQUFZOzRCQUN0Qix3Q0FBd0M7eUJBQzNDLENBQUM7d0JBQ0YsSUFBSSxFQUFFLENBQUM7cUJBQ1Y7eUJBQU07d0JBQ0gsSUFBQSx5QkFBVSxFQUFDLEVBQUMsS0FBSyxFQUFFLGdDQUFnQyxFQUFDLEVBQUUsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUNsRTtpQkFDSjtxQkFBTTtvQkFDSCxJQUFBLHlCQUFVLEVBQUMsRUFBQyxLQUFLLEVBQUUsZ0NBQWdDLEVBQUMsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2xFO1lBQ0wsQ0FBQyxDQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFPLEVBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FBQTtDQUNKO0FBdkNELHdDQXVDQyJ9