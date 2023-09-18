import { corsWithOptions } from "./cors.config.js";
import { routeStore, dbStore, pluralizeRoute, Assert, config } from '../../common/index.js';
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
        for (let name of Object.keys(dbStore))
            'account admin'.indexOf(name) === -1 && await DefaultRoutesConfig.instance(app, name, await DefaultController.createInstance(name));
    }
    buildMdWares(middlewares, useAuth = true, useAdmin = false) {
        let mdwares = [];
        if (useAuth === true)
            mdwares = [...mdwares, this.authenticate(config.authStrategy())]; //  authStr === 'az' ? 'oauth-bearer' :  jwt; ;
        if (useAdmin === true)
            mdwares = [...mdwares, this.mware.isInRole('admin')];
        if (middlewares)
            mdwares = [...mdwares, ...middlewares];
        return mdwares;
    }
    // custom routes
    buidRoute(routeName, method, actionName, secondRoute, middlewares) {
        const url = secondRoute ? (routeName + '/' + secondRoute) : routeName;
        return this.app[(method === 'list' ? 'get' : method)](url, ...this.buildMdWares(middlewares, ...this.controller?.db?.checkAuth(method)), this.actions(actionName ?? method));
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
        this.buidRoute(this.routeName, 'list', 'search', 'search'); // search
        this.buidRoute(this.routeName, 'list', 'count', 'count'); // count
        this.buidRoute(this.routeName, 'list', 'list'); // list
        this.buidRoute(this.routeParam, 'get', 'getOne'); // get By id
        this.buidRoute(this.routeName, 'get', 'getOne'); // getOne by filter parameter
        this.buidRoute(this.routeName, 'post'); // post
        this.buidRoute(this.routeParam, 'put'); // put
        this.buidRoute(this.routeParam, 'delete', null, null, [this.mware.validateCurrentUserOwnParamId]); // delete
        this.param();
        this.options(this.routeName);
        this.options(this.routeParam);
    }
    actions(actionName) {
        return this.controller.tryCatch(actionName);
    }
}
