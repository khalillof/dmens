"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require('dotenv').config();
const express_1 = (0, tslib_1.__importDefault)(require("express"));
//import * as http from 'http';
const http_errors_1 = (0, tslib_1.__importDefault)(require("http-errors"));
var path = require('path');
const winston = (0, tslib_1.__importStar)(require("winston"));
const expressWinston = (0, tslib_1.__importStar)(require("express-winston"));
const helmet_1 = (0, tslib_1.__importDefault)(require("helmet"));
const mongoose_service_1 = require("./common/services/mongoose.service");
const init_routes_config_1 = require("./routes/init.routes.config");
const passport_1 = (0, tslib_1.__importDefault)(require("passport"));
///////////////////////////////////////////
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ extended: false }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(passport_1.default.initialize());
// connect to db and initialise db models then
((_app) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    return yield (0, mongoose_service_1.dbInit)().then(() => {
        _app.use((0, helmet_1.default)({
            contentSecurityPolicy: false
        }));
        _app.use(expressWinston.logger({
            transports: [
                new winston.transports.Console()
            ],
            format: winston.format.combine(winston.format.colorize(), winston.format.json())
        }));
        (0, init_routes_config_1.initializeRoutes)(_app);
        function staticUrl(url) {
            return url.map((e) => path.join(__dirname, e)).forEach((url) => _app.use(express_1.default.static(url)));
        }
        staticUrl(['../public/coming_soon', '../public/angular', '../public/reactjs']);
        // catch 404 and forward to error handler
        _app.use(function (req, res, next) {
            next(http_errors_1.default[404]);
        });
        // error handler
        _app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }).catch((err) => console.error(err));
    //end
}))(app);
exports.default = app;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vcHVyZXRzL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFMUIsbUVBQThCO0FBQzlCLCtCQUErQjtBQUMvQiwyRUFBc0M7QUFDdEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLDhEQUFtQztBQUNuQyw2RUFBa0Q7QUFDbEQsaUVBQTRCO0FBQzVCLHlFQUE0RDtBQUM1RCxvRUFBK0Q7QUFDL0QscUVBQWdDO0FBQ2hDLDJDQUEyQztBQUMzQyxNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxvQkFBb0I7QUFDcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNoRCxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUU5QixHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUUvQiw4Q0FBOEM7QUFDOUMsQ0FBQyxDQUFPLElBQXdCLEVBQUMsRUFBRTtJQUVuQyxPQUFRLE1BQU0sSUFBQSx5QkFBTSxHQUFFLENBQUMsSUFBSSxDQUFDLEdBQUUsRUFBRTtRQUVoQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUEsZ0JBQU0sRUFBQztZQUNkLHFCQUFxQixFQUFFLEtBQUs7U0FDN0IsQ0FBQyxDQUFDLENBQUM7UUFFSixJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7WUFDN0IsVUFBVSxFQUFFO2dCQUNWLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUU7YUFDakM7WUFDRCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQ3pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQ3RCO1NBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFBLHFDQUFnQixFQUFDLElBQUksQ0FBQyxDQUFBO1FBRXZCLFNBQVMsU0FBUyxDQUFDLEdBQWtCO1lBQ25DLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3hHLENBQUM7UUFDRCxTQUFTLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFHL0UseUNBQXlDO1FBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFPLEVBQUUsR0FBTyxFQUFFLElBQVE7WUFDM0MsSUFBSSxDQUFDLHFCQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBUSxFQUFFLEdBQVEsRUFBRSxHQUFRLEVBQUUsSUFBUztZQUN4RCxrREFBa0Q7WUFFbEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUNqQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBRW5FLHdCQUF3QjtZQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7WUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBQyxFQUFFLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLEtBQUs7QUFFTCxDQUFDLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRVIsa0JBQWUsR0FBRyxDQUFDIn0=