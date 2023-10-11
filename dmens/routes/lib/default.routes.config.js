import { corsWithOptions } from "./cors.config.js";
import { Svc, Assert, envConfig } from '../../common/index.js';
import { middlewares } from '../../middlewares/index.js';
import { DefaultController } from '../../controllers/index.js';
import { authenticateUser } from '../../services/index.js';
import { appRouter } from '../../app.js';
export class DefaultRoutesConfig {
    router;
    routeName;
    routeParam;
    controller;
    mware;
    authenticate;
    //actions:Function;
    constructor(controller, callback) {
        if (!(controller instanceof DefaultController)) {
            envConfig.throwErr('route configration require instance of class DefaultController');
        }
        this.controller = controller;
        this.router = appRouter;
        this.routeName = this.controller.db.config.routeName;
        this.routeParam = this.routeName + '/:id';
        this.mware = middlewares;
        this.authenticate = authenticateUser;
        typeof callback === 'function' ? callback.call(this) : this.defaultRoutes();
        // add instance to routeStore
        Svc.routes.add(this);
        // this.app.use(this.router)
    }
    async buildMdWares(middlewares, useAuth = false, useAdmin = false) {
        let mdwares = [];
        if (useAuth === true)
            mdwares = [...mdwares, this.authenticate(envConfig.authStrategy())]; //  authStr === 'az' ? 'oauth-bearer' :  jwt; ;
        if (useAdmin === true)
            mdwares = [...mdwares, this.mware.isAdmin];
        if (middlewares)
            mdwares = [...mdwares, ...middlewares];
        return mdwares;
    }
    // custom routes
    async buidRoute(routeName, method, actionName, middlewares) {
        if (!routeName)
            throw new Error('buildRoute method require url or routeName');
        let aut = this.controller?.db.config.checkAuth(method) || [true, false];
        // map middlewares string fuction names to actual functions
        let mdwrs = this.mware;
        let mdwares = middlewares ? middlewares.map((m) => mdwrs[m]) : [];
        let mdwr = await this.buildMdWares(mdwares, ...aut);
        return this.router[((method === 'list') ? 'get' : method)](routeName, ...mdwr, this.actions(actionName ?? method));
    }
    setOptions(routPath) {
        this.router.options(routPath, corsWithOptions);
    }
    options() {
        this.setOptions(this.routeName);
        this.setOptions(this.routeParam);
    }
    param() {
        return this.router.param('id', async (req, res, next, id) => {
            try {
                Assert.idString(id);
                next();
            }
            catch (err) {
                res.json({ success: false, error: err.message });
                envConfig.logLine(err.stack);
            }
        });
    }
    async defaultRoutes() {
        await this.buidRoute(this.routeName + '/search', 'list', 'search'); // search
        await this.buidRoute(this.routeName + '/count', 'list', 'count'); // count
        await this.buidRoute(this.routeName + '/form', 'list', 'form'); // get form elements
        await this.buidRoute(this.routeName + '/route', 'list', 'route'); // get form elements
        await this.buidRoute(this.routeName, 'list', 'list'); // list
        await this.buidRoute(this.routeParam, 'get', 'getOne'); // get By id
        await this.buidRoute(this.routeName, 'get', 'getOne'); // getOne by filter parameter
        await this.buidRoute(this.routeName, 'post', null, this.controller?.db.config.middlewares); // post
        await this.buidRoute(this.routeParam, 'put', null, this.controller?.db.config.middlewares); // put
        await this.buidRoute(this.routeParam, 'delete', null, ['validateCurrentUserOwnParamId']); // delete
        this.param();
        this.options();
    }
    actions(actionName) {
        return this.controller.tryCatch(actionName);
    }
}
