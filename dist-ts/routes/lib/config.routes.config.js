"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigRoutes = void 0;
const index_js_1 = require("../../controllers/index.js");
const default_routes_config_js_1 = require("./default.routes.config.js");
async function ConfigRoutes() {
    return new default_routes_config_js_1.DefaultRoutesConfig(new index_js_1.ConfigController(), async function () {
        await this.defaultClientRoutes();
        // await this.defaultRoutes()
        await this.list(this.addPath('/routes'), 'routes', ['authenticate', 'isAdmin']);
        await this.delete(this.addPath('/route/delete'), 'deleteRoute', ['authenticate', 'isAdmin']);
        await this.list(this.addPath('/forms'), 'forms');
        await this.list(this.addPath('/viewsdata'), 'viewsData');
    });
}
exports.ConfigRoutes = ConfigRoutes;
