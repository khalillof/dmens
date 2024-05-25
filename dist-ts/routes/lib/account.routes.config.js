"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRoutes = void 0;
const index_js_1 = require("../../controllers/index.js");
const default_routes_config_js_1 = require("./default.routes.config.js");
// auth routes 
async function AccountRoutes() {
    return new default_routes_config_js_1.DefaultRoutesConfig(new index_js_1.AccountController(), async function () {
        await this.defaultClientRoutes();
        await this.create(this.addPath('/signup'), 'signup', ['checkLoginUserFields']);
        await this.create(this.addPath('/signin'), 'signin', ['checkLoginUserFields']);
        await this.get(this.addPath('/logout'), 'logout');
        // get secrets form envirmoment variables
        await this.get(this.addPath('/secure'), 'secure', ['authenticate', 'isAdmin']);
        await this.get(undefined, undefined, ['validateCurrentUserOwnParamId', 'authenticate']);
        await this.delete(undefined, undefined, ['validateCurrentUserOwnParamId', 'authenticate']);
        await this.update(undefined, undefined, ['validateCurrentUserOwnParamId', 'authenticate']);
        // get profile require query string eg ==>  /auth/profile?email=user@user.co
        await this.get(this.addPath('/profile', true), 'profile', ['authenticate', 'validateHasQueryEmailBelongToCurrentUser']);
        await this.list(); // all acounts
    });
}
exports.AccountRoutes = AccountRoutes;
