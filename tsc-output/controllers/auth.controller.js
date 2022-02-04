"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tslib_1 = require("tslib");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const default_controller_1 = require("./default.controller");
const types_config_1 = require("../common/customTypes/types.config");
// todo: move to a secure place
const jwtSecret = 'My!@!Se3cr8tH4sh';
const tokenExpirationInSeconds = 36000;
class AuthController extends default_controller_1.DefaultController {
    constructor() {
        super('user');
    }
    static createInstance() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var result = new AuthController();
            if (!result.svc) {
                result.setDb('user');
            }
            return yield Promise.resolve(result);
        });
    }
    createJWT(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                let refreshId = req.body._id + jwtSecret;
                let salt = crypto.randomBytes(16).toString('base64');
                let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
                req.body.refreshKey = salt;
                let token = jwt.sign(req.body, jwtSecret, { expiresIn: tokenExpirationInSeconds });
                let b = Buffer.from(hash);
                let refreshToken = b.toString('base64');
                return (0, types_config_1.returnJson)({ accessToken: token, refreshToken: refreshToken }, 201, res);
            }
            catch (err) {
                return (0, types_config_1.returnJson)(err, 500, res);
            }
        });
    }
}
exports.AuthController = AuthController;
//export default new AuthController();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vcHVyZXRzL2NvbnRyb2xsZXJzL2F1dGguY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyw2REFBc0Q7QUFDdEQscUVBQTZEO0FBQzdELCtCQUErQjtBQUMvQixNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQztBQUNyQyxNQUFNLHdCQUF3QixHQUFHLEtBQUssQ0FBQztBQUV2QyxNQUFhLGNBQWUsU0FBUSxzQ0FBaUI7SUFFakQ7UUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDakIsQ0FBQztJQUVNLE1BQU0sQ0FBTyxjQUFjOztZQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ2xDLElBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDeEI7WUFDSCxPQUFRLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxDQUFDO0tBQUE7SUFDSyxTQUFTLENBQUMsR0FBb0IsRUFBRSxHQUFxQjs7WUFDdkQsSUFBSTtnQkFDQSxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUM7Z0JBQ3pDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRixHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQzNCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBQyxTQUFTLEVBQUUsd0JBQXdCLEVBQUMsQ0FBQyxDQUFDO2dCQUNqRixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QyxPQUFPLElBQUEseUJBQVUsRUFBQyxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQzthQUMvRTtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLE9BQU8sSUFBQSx5QkFBVSxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbkM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTNCRCx3Q0EyQkM7QUFFRCxzQ0FBc0MifQ==