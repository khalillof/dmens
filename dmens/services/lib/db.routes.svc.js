import { envs } from "../../common/index.js";
import { dbStore, routeStore } from "../../common/lib/helpers.js";
import { appRouter } from '../../app.js';
import pluralize from '../../common/lib/pluralize.js';
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
            envs.logLine(`just added ( " ${obj[this.key]} " ) to ${this.objName} :`);
        }
    }
    delete(keyValue) {
        let index = this.obj().findIndex((c) => c[this.key] === keyValue) ?? null;
        if (index !== -1)
            this.obj().splice(index, 1);
        ;
        envs.logLine(`just deleted ( " ${this.key} ) from ${this.objName} :`);
    }
}
class RouteSvc extends SvcInstance {
    constructor() {
        super('routeName');
    }
    print() {
        envs.logLine(" ***** All app routes *******: \n", this.getAllRoutesToString());
    }
    deleteAppRoute(routeName) {
        this.routesLoop(routeName, (item, index) => {
            appRouter.stack.splice(index, 1);
            let msg = `route deleted : ${this.getMethod(item.route)} : ${item.route.path} `;
            envs.logLine(msg);
        });
        // delete route object Default.ConfigRoute
        this.delete(routeName);
    }
    deleteRoutePath(routePath) {
        this.routesLoop(routePath, (item, index) => {
            if (item && item.route.path === routePath) {
                appRouter.stack.splice(index, 1);
                let msg = `route path deleted : ${this.getMethod(item.route)} : ${item.route.path} `;
                envs.logLine(msg);
            }
        });
    }
    getRoutesToString(routeName) {
        return routeName ? this.ToString(this.getRoutesPathMethods(routeName)) : "";
    }
    getRoutesToJsonString(routeName) {
        return routeName ? this.ToJson(this.getRoutesPathMethods(routeName)) : "";
    }
    getAllRoutesToString() {
        return this.ToString(this.getRoutesPathMethods());
    }
    getAllRoutesToJsonString() {
        return this.ToJson(this.getRoutesPathMethods());
    }
    getRoutesPathMethods(routeName) {
        return this.getRoutes(routeName)
            .map((route) => {
            return {
                method: this.getMethod(route),
                path: route.path
            };
        });
    }
    getRoutes(routePath) {
        if (routePath)
            return appRouter.stack.filter((r) => r.route && r.route.path.startsWith(routePath)).map((r) => r.route);
        return appRouter.stack.filter((r) => r.route).map((r) => r.route);
    }
    pluralizeRoute(routeName) {
        return pluralize(routeName);
    }
    //========================================================================================
    ToString(obj) {
        return obj.map((r) => r.method + " => " + r.path).join("\n");
    }
    ToJson(obj) {
        return JSON.stringify(obj, null, 2);
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
