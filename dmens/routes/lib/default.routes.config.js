import { corsWithOptions } from "./cors.config.js";
import { routeStore, dbStore, pluralizeRoute, Assert } from '../../common/index.js';
import { Middlewares } from '../../middlewares/index.js';
import { DefaultController } from '../../controllers/index.js';
import { authenticateUser } from '../../services/index.js';
export async function getMware() {
    let item = Object.values(routeStore).find(r => r.mware !== null);
    let result = item && item.mware ? item.mware : await Middlewares.createInstance();
    return result;
}
export class DefaultRoutesConfig {
    app;
    routeName;
    routeParam;
    controller;
    mware;
    authenticate;
    //actions:Function;
    constructor(exp, rName, controller, MWare, callback) {
        this.app = exp;
        this.routeName = pluralizeRoute(rName);
        this.routeParam = this.routeName + '/:id';
        this.controller = controller;
        this.mware = MWare;
        this.authenticate = authenticateUser;
        typeof callback === 'function' ? callback(this) : this.defaultRoutes();
        // add instance to routeStore
        routeStore[this.routeName] = this;
        console.log('Added ( ' + this.routeName + ' ) to routeStore');
    }
    static async instance(exp, rName, control, callback) {
        let umwre = control && await getMware();
        let result = new DefaultRoutesConfig(exp, rName, control, umwre, callback);
        return result;
    }
    static async createInstancesWithDefault(app) {
        return Object.keys(dbStore).forEach(async (name) => { if ('account admin'.indexOf(name) === -1)
            await DefaultRoutesConfig.instance(app, name, await DefaultController.createInstance(name)); });
    }
    buildMdWares(middlewares, useAuth = true, useAdmin = false) {
        let mdwares = [];
        if (useAuth)
            mdwares = [...mdwares, this.authenticate("jwt")];
        if (useAdmin)
            mdwares = [...mdwares, this.mware.isInRole('admin')];
        if (middlewares)
            mdwares.concat(middlewares);
        return mdwares;
    }
    // custom routes
    getCount(middlewares = null) {
        return this.app.get(this.routeName + '/count', ...this.buildMdWares(middlewares, ...this.controller?.db?.checkAuth('count')), this.actions('count'));
    }
    getList(middlewares = null) {
        return this.app.get(this.routeName, ...this.buildMdWares(middlewares, ...this.controller?.db?.checkAuth('list')), this.actions('list'));
    }
    getId(middlewares = null) {
        return this.app.get(this.routeParam, ...this.buildMdWares(middlewares, ...this.controller?.db?.checkAuth('get')), this.actions('findById'));
    }
    post(middlewares = null) {
        return this.app.post(this.routeName, ...this.buildMdWares(middlewares, ...this.controller?.db?.checkAuth('post')), this.actions('create'));
    }
    put(middlewares = null) {
        return this.app.put(this.routeParam, ...this.buildMdWares(middlewares, ...this.controller?.db?.checkAuth('put')), this.actions('put'));
    }
    delete(middlewares = null) {
        let mdl = middlewares ? middlewares : [this.mware.validateCurrentUserOwnParamId];
        return this.app.delete(this.routeParam, ...this.buildMdWares(mdl, ...this.controller?.db?.checkAuth('delete')), this.actions('remove'));
    }
    options(routPath) {
        this.app.options(routPath, corsWithOptions);
    }
    param() {
        return this.app.param('id', async (req, res, next, id) => {
            try {
                Assert.idString(id);
                next();
            }
            catch (err) {
                res.json({ success: false, error: err.message });
                console.log(err.stack);
            }
        });
    }
    defaultRoutes() {
        this.getCount();
        this.getList();
        this.getId();
        this.post();
        this.put();
        this.delete();
        this.param();
        this.options(this.routeName);
        this.options(this.routeParam);
    }
    actions(actionName) {
        return this.controller.tryCatchActions(actionName);
    }
}
