/** @license @tuban/dmens v2.0.2
 *
 * This source code is licensed under the ISC license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.app = void 0;
const tslib_1 = require("tslib");
const index_js_1 = require("./common/index.js");
const path_1 = tslib_1.__importDefault(require("path"));
const compression_1 = tslib_1.__importDefault(require("compression"));
const express_1 = tslib_1.__importDefault(require("express"));
const express_session_1 = tslib_1.__importDefault(require("express-session"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const index_js_2 = require("./services/index.js");
const index_js_3 = require("./services/index.js");
const index_js_4 = require("./routes/index.js");
const www_js_1 = require("./bin/www.js");
exports.app = (0, express_1.default)();
exports.appRouter = express_1.default.Router();
const appSettings = async () => {
    // Create the Express application
    exports.app.use(express_1.default.json({ limit: "20mb" }));
    exports.app.use(express_1.default.urlencoded({ limit: "20mb", extended: true }));
    // compress all responses
    exports.app.use((0, compression_1.default)());
    // view engine setup
    //app.set('views', path.join(config.baseDir, 'views'));
    //app.set('view engine', 'ejs');
    // static urls
    let staticUrl = index_js_1.envs.static_url();
    if (staticUrl) {
        let staticBaseUrl = path_1.default.join(__dirname, staticUrl);
        exports.app.use(express_1.default.static(staticBaseUrl));
        // handel spa fallback
        exports.app.get(' ', (req, res, next) => {
            res.sendFile(path_1.default.join(staticBaseUrl, '/index.html'));
        });
    }
    // request looger using a predefined format string
    exports.app.use((0, morgan_1.default)(index_js_1.envs.isDevelopment ? 'dev' : 'combined')); // dev|common|combined|short|tiny
    exports.app.use((0, express_session_1.default)({
        secret: index_js_1.envs.secretKey(),
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 30,
            secure: true,
            httpOnly: true,
        }
    }));
    exports.app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
    exports.app.use(passport_1.default.initialize());
    exports.app.use(passport_1.default.session());
    passport_1.default.serializeUser(function (user, done) {
        console.log('-----------------------------');
        console.log('serialize user');
        console.log(user);
        console.log('-----------------------------');
        done(null, user);
    });
    passport_1.default.deserializeUser(function (user, done) {
        console.log('-----------------------------');
        console.log('deserialize user');
        console.log(user);
        console.log('-----------------------------');
        done(null, user);
    });
    // create database models
    await (0, index_js_3.dbInit)();
    // cors activation
    exports.app.use(index_js_4.corsWithOptions);
    //enable CORS (for testing only -remove in production/deployment)
    //app.use((req, res, next) => {
    //  res.header('Access-Control-Allow-Origin', '*');
    //  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    //  next();
    //});
    // app routes
    exports.app.use('/api', exports.appRouter);
    // handel 404 shoud be at the midlleware
    exports.app.use((req, res, next) => {
        res.status(404).json({ success: false, message: "Not Found" });
    });
    // server error handller will print stacktrace
    exports.app.use(function (err, req, res, next) {
        res.status(err.status || 500).json({ success: false, error: index_js_1.envs.isDevelopment ? err.message : "Ops! server error" });
        console.error(err.stack);
    });
    // print routes
    index_js_2.Store.route.print();
    // seed database
    await new index_js_3.ClientSeedDatabase().init();
    if (!index_js_1.envs.isDevelopment) {
        (0, www_js_1.menServer)(exports.app, false);
    }
    else {
        exports.app.listen(index_js_1.envs.port(), () => index_js_1.envs.logLine(`development server is running on port: ${index_js_1.envs.port()}`));
    }
};
appSettings().then(() => console.log('success >>>>>>>>>>>>>>>>>')).catch(err => console.error(err));
