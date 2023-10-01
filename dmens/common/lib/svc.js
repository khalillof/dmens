import { envConfig } from "../index.js";
import { dbStore, routeStore } from "./helpers.js";
import { appRouter } from '../../app.js';
import pluralize from './pluralize.js';
class SvcInstance {
    key;
    objName;
    constructor(key) {
        this.key = key;
        this.objName = key === 'name' ? "dbStore" : "routrStore";
    }
    len() {
        return this.obj().length;
    }
    exist(keyValue) {
        return this.get(keyValue) !== null;
    }
    obj() {
        return this.key === "name" ? dbStore : routeStore;
    }
    get(keyValue) {
        return this.obj().find((c) => c[this.key] === keyValue) ?? null;
    }
    add(obj) {
        if (!this.exist(obj.name)) {
            this.obj().push(obj);
            envConfig.logLine(`just added ( " ${obj[this.key]} " ) to ${this.objName} :`);
        }
    }
    delete(keyValue) {
        let index = this.obj().findIndex((c) => c[this.key] === keyValue) ?? null;
        if (index !== -1)
            this.obj().splice(index, 1);
        ;
        envConfig.logLine(`just deleted ( " ${this.key} ) from ${this.objName} :`);
    }
}
class RouteSvc extends SvcInstance {
    constructor() {
        super('routeName');
    }
    deleteAppRoute(routePath) {
        let self = this;
        this.routesLoop(routePath, function (item, index) {
            appRouter.stack.splice(index, 1);
            let msg = `route deleted : ${self.getMethod(item.route)} : ${item.route.path} `;
            envConfig.logLine(msg);
        });
    }
    getRoutesToString(routeName) {
        let result = this.getAppRoutes(routeName)
            .map((r) => this.getMethod(r).padEnd(7) + " : " + r.path)
            .join("\n");
        return result;
    }
    getRoutesToJsonString(routeName) {
        let result = this.getAppRoutes(routeName)
            .map((r) => {
            return {
                method: this.getMethod(r),
                path: r.path
            };
        });
        return JSON.stringify(result, null, 2);
    }
    getAllRoutesToString() {
        let result = appRouter.stack.filter((r) => r.route)
            .map((r) => this.getMethod(r.route).padEnd(7) + r.route.path).join("\n");
        console.log('================= All Routes avaliable ================ \n' + result);
        return result;
    }
    getAllRoutesToJsonString() {
        let result = appRouter.stack.filter((r) => r.route)
            .map((r) => {
            return {
                method: this.getMethod(r.route),
                path: r.route.path
            };
        });
        console.log('================= All Routes avaliable ================ \n' + JSON.stringify(result, null, 2));
        return result;
    }
    pluralizeRoute(routeName) {
        routeName = routeName.toLowerCase();
        if (routeName.indexOf('/') == -1) {
            return ('/' + pluralize(routeName));
        }
        else {
            return routeName;
        }
    }
    getAppRoutes(routePath) {
        return appRouter.stack.filter((r) => r.route && r.route.path.startsWith(routePath)).map((r) => r.route);
    }
    getMethod(routeObj) {
        return Object.keys(routeObj.methods)[0].toUpperCase();
    }
    routesLoop(routePath, callback) {
        const len = appRouter.stack.length;
        for (let index = 0; index < len; index++) {
            let item = appRouter.stack[index];
            if (item && item.route.path.startsWith(routePath)) {
                callback(item, index);
            }
        }
    }
}
class Svc {
    db;
    routes;
    constructor() {
        this.db = new SvcInstance('name');
        this.routes = new RouteSvc();
    }
}
export default new Svc();
