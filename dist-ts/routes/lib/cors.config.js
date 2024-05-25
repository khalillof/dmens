"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsWithOptions = exports.cors = void 0;
const tslib_1 = require("tslib");
const cors_1 = tslib_1.__importDefault(require("cors"));
const index_js_1 = require("../../common/index.js");
//const corsOptions = (req:any, callback:Function)=> callback(null, {origin: config.cores_domains().indexOf(req.header('Origin')) !== -1});
const getOptions = (origin) => ({
    origin, "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
});
function corsOptionsDelegate(req, callback) {
    let origin = req.header('Origin');
    const whiteList = index_js_1.envs.allow_origins();
    let corsOptions;
    if (whiteList.indexOf(origin) !== -1) {
        corsOptions = getOptions(true); // reflect (enable) the requested origin in the CORS response
    }
    else {
        corsOptions = getOptions(false); // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
}
const cors = (0, cors_1.default)();
exports.cors = cors;
const corsWithOptions = (0, cors_1.default)(corsOptionsDelegate);
exports.corsWithOptions = corsWithOptions;
