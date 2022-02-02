"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtMiddleware = void 0;
const types_config_1 = require("../../common/customTypes/types.config");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// todo: remove-me
const jwtSecret = 'My!@!Se3cr8tH4sh';
class JwtMiddleware {
    static getInstance() {
        if (!JwtMiddleware.instance) {
            JwtMiddleware.instance = new JwtMiddleware();
        }
        return JwtMiddleware.instance;
    }
    verifyRefreshBodyField(req, res, next) {
        if (req.body && req.body.refreshToken) {
            next();
        }
        else {
            (0, types_config_1.returnJson)({ error: 'need body field: refreshToken' }, 400, res);
        }
    }
    ;
    validRefreshNeeded(req, res, next) {
        let b = Buffer.from(req.body.refreshToken, 'base64');
        let refreshToken = b.toString();
        let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + jwtSecret).digest("base64");
        if (hash === refreshToken) {
            delete req.jwt.iat;
            delete req.jwt.exp;
            req.body = req.jwt;
            return next();
        }
        else {
            (0, types_config_1.returnJson)({ error: 'Invalid refresh token' }, 400, res);
        }
    }
    ;
    validJWTNeeded(req, res, next) {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    (0, types_config_1.returnJson)({ error: 'need: refreshToken' }, 401, res);
                }
                else {
                    req.jwt = jwt.verify(authorization[1], jwtSecret);
                    next();
                }
            }
            catch (err) {
                (0, types_config_1.returnJson)({ error: 'error' }, 403, res);
            }
        }
        else {
            (0, types_config_1.returnJson)({ error: 'need body field: refreshToken' }, 401, res);
        }
    }
    ;
}
exports.JwtMiddleware = JwtMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0Lm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXV0aC9taWRkbGV3YXJlcy9qd3QubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3RUFBZ0U7QUFDaEUsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVqQyxrQkFBa0I7QUFDbEIsTUFBTSxTQUFTLEdBQUcsa0JBQWtCLENBQUM7QUFFckMsTUFBYSxhQUFhO0lBR3RCLE1BQU0sQ0FBQyxXQUFXO1FBQ2QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUU7WUFDekIsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBMEI7UUFDMUYsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2xDLElBQUksRUFBRSxDQUFDO1NBQ1g7YUFBTTtZQUNILElBQUEseUJBQVUsRUFBQyxFQUFDLEtBQUssRUFBRSwrQkFBK0IsRUFBQyxFQUFFLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQztTQUNqRTtJQUNMLENBQUM7SUFBQSxDQUFDO0lBRUYsa0JBQWtCLENBQUMsR0FBUSxFQUFFLEdBQXFCLEVBQUUsSUFBMEI7UUFDMUUsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9HLElBQUksSUFBSSxLQUFLLFlBQVksRUFBRTtZQUN2QixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQ25CLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7WUFDbkIsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQ25CLE9BQU8sSUFBSSxFQUFFLENBQUM7U0FDakI7YUFBTTtZQUNILElBQUEseUJBQVUsRUFBQyxFQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBQyxFQUFFLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQztTQUN6RDtJQUNMLENBQUM7SUFBQSxDQUFDO0lBRUYsY0FBYyxDQUFDLEdBQVEsRUFBRSxHQUFxQixFQUFFLElBQTBCO1FBQ3RFLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUM5QixJQUFJO2dCQUNBLElBQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7b0JBQzlCLElBQUEseUJBQVUsRUFBQyxFQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFBQyxFQUFFLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQztpQkFDdkQ7cUJBQU07b0JBQ0gsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDbEQsSUFBSSxFQUFFLENBQUM7aUJBQ1Y7YUFFSjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLElBQUEseUJBQVUsRUFBQyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7YUFDekM7U0FDSjthQUFNO1lBQ0gsSUFBQSx5QkFBVSxFQUFDLEVBQUMsS0FBSyxFQUFFLCtCQUErQixFQUFDLEVBQUUsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2pFO0lBRUwsQ0FBQztJQUFBLENBQUM7Q0FDTDtBQW5ERCxzQ0FtREMifQ==