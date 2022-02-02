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
    constructor(svc) {
        super(svc);
    }
    static createInstance() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let s = yield (0, types_config_1.getSvc)('/users');
            var result = new AuthController(s);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL2F1dGguY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyw2REFBc0Q7QUFDdEQscUVBQXFFO0FBRXJFLCtCQUErQjtBQUMvQixNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQztBQUNyQyxNQUFNLHdCQUF3QixHQUFHLEtBQUssQ0FBQztBQUV2QyxNQUFhLGNBQWUsU0FBUSxzQ0FBaUI7SUFFakQsWUFBWSxHQUFRO1FBQ2hCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNkLENBQUM7SUFFTSxNQUFNLENBQU8sY0FBYzs7WUFDOUIsSUFBSSxDQUFDLEdBQUcsTUFBTSxJQUFBLHFCQUFNLEVBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0IsSUFBSSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsT0FBUSxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBQ0ssU0FBUyxDQUFDLEdBQW9CLEVBQUUsR0FBcUI7O1lBQ3ZELElBQUk7Z0JBQ0EsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO2dCQUN6QyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEYsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLHdCQUF3QixFQUFDLENBQUMsQ0FBQztnQkFDakYsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEMsT0FBTyxJQUFBLHlCQUFVLEVBQUMsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7YUFDL0U7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixPQUFPLElBQUEseUJBQVUsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUF6QkQsd0NBeUJDO0FBRUQsc0NBQXNDIn0=