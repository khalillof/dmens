import { corsWithOptions } from "./cors.config.js";
import { Svc, Assert, envs } from '../../common/index.js';
import { middlewares } from '../../middlewares/index.js';
import { DefaultController } from '../../controllers/index.js';
import { appRouter } from '../../app.js';
// defaultActions =['list','get', 'create', 'update','patch', 'delete', 'search', 'count', 'form', 'route', 'modeldata']
//const isDefaultActions = (action: string) => defaultActions.indexOf(action) !== -1;
export class DefaultRoutesConfig {
    router;
    config;
    controller;
    mware;
    baseRoutePath;
    baseRouteParam;
    constructor(controller, callback) {
        if (!(controller instanceof DefaultController)) {
            envs.throwErr('route configration require instance of class DefaultController');
        }
        this.controller = controller;
        this.config = controller.db.config;
        this.baseRoutePath = controller.db.config.baseRoutePath;
        this.baseRouteParam = controller.db.config.routeParam;
        this.router = appRouter;
        this.mware = middlewares;
        typeof callback === 'function' ? callback.call(this) : this.defaultRoutes();
        // add instance to routeStore
        Svc.routes.add(this);
    }
    addPath(name, param) {
        if (param)
            return this.baseRouteParam + (name.startsWith('/') ? name : '/' + name);
        return this.baseRoutePath + (name.startsWith('/') ? name : '/' + name);
    }
    setOptions(routPath) {
        this.router.options(routPath, corsWithOptions);
    }
    options() {
        this.setOptions(this.baseRoutePath);
        this.setOptions(this.baseRouteParam);
    }
    setParam() {
        return this.router.param(this.config.paramId, async (req, res, next, id) => {
            try {
                Assert.idString(id);
                next();
            }
            catch (err) {
                res.json({ success: false, error: err.message });
                envs.logLine(err.stack);
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
        await this.defaultClientRoutes();
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
