"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRoutesConfig = void 0;
const cors_config_js_1 = require("./cors.config.js");
const index_js_1 = require("../../common/index.js");
const index_js_2 = require("../../services/index.js");
const index_js_3 = require("../../middlewares/index.js");
const index_js_4 = require("../../controllers/index.js");
const index_js_5 = require("../../index.js");
// defaultActions =['list','get', 'create', 'update','patch', 'delete', 'search', 'count', 'form', 'route', 'modeldata']
//const isDefaultActions = (action: string) => defaultActions.indexOf(action) !== -1;
class DefaultRoutesConfig {
    router;
    config;
    controller;
    mware;
    baseRoutePath;
    baseRouteParam;
    routeName;
    constructor(controller, callback) {
        if (!(controller instanceof index_js_4.DefaultController)) {
            index_js_1.envs.throwErr('route configration require instance of class DefaultController');
        }
        this.controller = controller;
        this.config = controller.db.config;
        this.routeName = controller.db.config.routeName;
        this.baseRoutePath = controller.db.config.baseRoutePath;
        this.baseRouteParam = controller.db.config.routeParam;
        this.router = index_js_5.appRouter;
        this.mware = index_js_3.middlewares;
        if (typeof callback === 'function') {
            callback.call(this);
        }
        else {
            this.defaultRoutes();
            this.defaultClientRoutes();
        }
        // add instance to routeStore
        index_js_2.Store.route.add(this);
    }
    addPath(name, param) {
        if (param)
            return this.baseRouteParam + (name.startsWith('/') ? name : '/' + name);
        return this.baseRoutePath + (name.startsWith('/') ? name : '/' + name);
    }
    setOptions(routPath) {
        this.router.options(routPath, cors_config_js_1.corsWithOptions);
    }
    options() {
        this.setOptions(this.baseRoutePath);
        this.setOptions(this.baseRouteParam);
    }
    setParam() {
        return this.router.param(this.config.paramId, async (req, res, next, id) => {
            try {
                index_js_1.Assert.idString(id);
                next();
            }
            catch (err) {
                res.json({ success: false, error: err.message });
                index_js_1.envs.logLine(err.stack);
            }
        });
    }
    async defaultClientRoutes() {
        await this.get(this.addPath('/search'), 'search'); // search
        await this.get(this.addPath('/count'), 'count'); // count
        await this.get(this.addPath('/form'), 'form'); // get form elements
        await this.get(this.addPath('/route'), 'route'); // get form routes
        await this.get(this.addPath('/viewdata'), 'viewData'); // get model routeData
    }
    async defaultRoutes() {
        await this.list(); // list   
        await this.get(); // get by id
        await this.get(this.addPath('/one')); // getOne by filter parameter
        await this.create(); // post
        await this.update(); // put
        await this.patch(); // patch
        await this.delete(); // delete
        this.setParam();
        this.options();
    }
    async setMiddlewars(action, middlewares = []) {
        let mware = this.mware;
        let mdrs = [...middlewares, ...this.config.authAdminMiddlewares(action)].map((m) => mware[m]);
        //debug only console.log(`mode name :${this.config.name}:  >>>> action :${action} `)
        return [...mdrs, this.actions(action)];
    }
    async list(path, action, middlewares) {
        await this.router.get(path ?? this.baseRoutePath, await this.setMiddlewars(action ?? 'list', middlewares));
    }
    async get(path, action, middlewares) {
        await this.router.get(path ?? this.baseRouteParam, await this.setMiddlewars(action ?? 'getOne', middlewares));
    }
    async create(path, action, middlewares) {
        await this.router.post(path ?? this.addPath('/create'), await this.setMiddlewars(action ?? 'create', [...(middlewares ? middlewares : []), ...this.config.postPutMiddlewares]));
    }
    async update(path, action, middlewares) {
        await this.router.put(path ?? this.addPath('/update', true), await this.setMiddlewars(action ?? 'update', [...(middlewares ? middlewares : []), ...this.config.postPutMiddlewares]));
    }
    async delete(path, action, middlewares) {
        await this.router.delete(path || this.addPath('/delete', true), await this.setMiddlewars(action ?? 'delete', [...(middlewares ? middlewares : []), 'validateCurrentUserOwnParamId']));
    }
    async patch(path, action, middlewares) {
        await this.router.patch(path || this.addPath('/patch', true), await this.setMiddlewars(action ?? 'patch', middlewares));
    }
    actions(actionName) {
        return this.controller.tryCatch(actionName);
    }
}
exports.DefaultRoutesConfig = DefaultRoutesConfig;
