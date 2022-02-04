"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const tslib_1 = require("tslib");
const passport_1 = (0, tslib_1.__importDefault)(require("passport"));
const FacebookTokenStrategy = (0, tslib_1.__importStar)(require("passport-facebook-token"));
const passport_jwt_1 = require("passport-jwt");
const passport_jwt_2 = require("passport-jwt");
const jwt = (0, tslib_1.__importStar)(require("jsonwebtoken")); // used to create, sign, and verify tokens
const config_1 = require("../../bin/config");
const types_config_1 = require("../../common/customTypes/types.config");
////////////////////////
class JwtService {
    //readonly db: Model;
    constructor() {
        this.jwtPassport = passport_1.default.use(new passport_jwt_1.Strategy({
            jwtFromRequest: passport_jwt_2.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config_1.config.secretKey
        }, (jwt_payload, done) => {
            let db = types_config_1.dbStore['User'];
            console.log("JWT payload: ", jwt_payload);
            db.findOne({ _id: jwt_payload._id }, (err, user) => {
                console.log;
                if (err) {
                    return done(err, false);
                }
                else if (user) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });
        }));
        this.verifyUser = passport_1.default.authenticate('jwt', { session: false });
        // facebook
        this.facebookPassport = passport_1.default.use(new FacebookTokenStrategy.default({
            clientID: config_1.config.facebook.clientId,
            clientSecret: config_1.config.facebook.clientSecret
        }, (accessToken, refreshToken, profile, done) => {
            let db = types_config_1.dbStore['User'];
            db.findOne({ facebookId: profile.id }, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (!err && user !== null) {
                    return done(null, user);
                }
                else {
                    user = { username: profile.displayName };
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.email = profile.email;
                    user.save((err, user) => {
                        if (err)
                            return done(err, false);
                        else
                            return done(null, user);
                    });
                }
            });
        }));
    }
    static createInstance() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let jwt = new JwtService();
            return yield Promise.resolve(jwt);
        });
    }
    static generateToken(user) {
        try {
            return jwt.sign(user, config_1.config.secretKey, { expiresIn: 3600 });
        }
        catch (err) {
            throw err;
        }
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wdXJldHMvYXV0aC9zZXJ2aWNlcy9qd3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEscUVBQWdDO0FBQ2hDLDRGQUFrRTtBQUNsRSwrQ0FBc0Q7QUFDdEQsK0NBQXlDO0FBQ3pDLCtEQUFvQyxDQUFDLDBDQUEwQztBQUMvRSw2Q0FBd0M7QUFDeEMsd0VBQTZEO0FBRzdELHdCQUF3QjtBQUN4QixNQUFhLFVBQVU7SUFDckIscUJBQXFCO0lBQ3JCO1FBZUUsZ0JBQVcsR0FBNkIsa0JBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSx1QkFBVyxDQUFDO1lBQ2pFLGNBQWMsRUFBRSx5QkFBVSxDQUFDLDJCQUEyQixFQUFFO1lBQ3hELFdBQVcsRUFBRyxlQUFNLENBQUMsU0FBUztTQUNqQyxFQUNHLENBQUMsV0FBZ0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtZQUM1QixJQUFJLEVBQUUsR0FBRSxzQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUcsRUFBQyxFQUFFLENBQUMsR0FBUSxFQUFFLElBQVMsRUFBRSxFQUFFO2dCQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFBO2dCQUNYLElBQUksR0FBRyxFQUFFO29CQUNMLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDM0I7cUJBQ0ksSUFBSSxJQUFJLEVBQUU7b0JBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUMzQjtxQkFDSTtvQkFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQzVCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBR0osZUFBVSxHQUFRLGtCQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ2pFLFdBQVc7UUFDWCxxQkFBZ0IsR0FBRyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLHFCQUFxQixDQUFDLE9BQU8sQ0FBQztZQUM5RCxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRO1lBQ2xDLFlBQVksRUFBRSxlQUFNLENBQUMsUUFBUSxDQUFDLFlBQVk7U0FDN0MsRUFBRSxDQUFDLFdBQWlCLEVBQUUsWUFBaUIsRUFBRSxPQUFZLEVBQUUsSUFBUSxFQUFFLEVBQUU7WUFDaEUsSUFBSSxFQUFFLEdBQUUsc0JBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QixFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEdBQU8sRUFBRSxJQUFRLEVBQUUsRUFBRTtnQkFDdkQsSUFBSSxHQUFHLEVBQUU7b0JBQ0wsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUMzQjtnQkFDRCxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7b0JBQ3ZCLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDM0I7cUJBQ0k7b0JBQ0QsSUFBSSxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDekMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO29CQUN4QyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUE7b0JBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFRLEVBQUUsSUFBUyxFQUFFLEVBQUU7d0JBQzlCLElBQUksR0FBRzs0QkFDSCxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7OzRCQUV4QixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2hDLENBQUMsQ0FBQyxDQUFBO2lCQUNMO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQ0EsQ0FBQyxDQUFDO0lBaEVMLENBQUM7SUFDQyxNQUFNLENBQU8sY0FBYzs7WUFDdkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQTtZQUMxQixPQUFPLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNyQyxDQUFDO0tBQUE7SUFDTSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVM7UUFDakMsSUFBSTtZQUNBLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBQyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1NBQzdEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixNQUFNLEdBQUcsQ0FBQztTQUNiO0lBQ0wsQ0FBQztDQXNESjtBQXJFRCxnQ0FxRUMifQ==