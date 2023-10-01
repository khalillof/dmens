import { IDbModel, IDefaultRoutesConfig, ISvc, ISvcIntance, IRouteSvc } from "../../interfaces/index.js";
import { envConfig } from "../index.js";
import { dbStore, routeStore } from "./helpers.js";
import { appRouter } from '../../app.js'
import pluralize from './pluralize.js';
import { IRoute } from "express";

class SvcInstance<T> implements ISvcIntance<T> {

    key: string
    objName: string

    constructor(key: "name" | "routeName") {
        this.key = key;
        this.objName = key === 'name' ? "dbStore" : "routrStore";
    }

    len(): number {
        return this.obj().length;
    }
    exist(keyValue: string): boolean {
        return this.get(keyValue) !== null;
    }
    obj(): T[] {
        return this.key === "name" ? dbStore as T[] : routeStore as T[];
    }
    get(keyValue: string): T | null {
        return this.obj().find((c: any) => c[this.key] === keyValue) ?? null
    }

    add(obj: T | any): void {
        if (!this.exist(obj.name)) {
            this.obj().push(obj);
            envConfig.logLine(`just added ( " ${obj[this.key]} " ) to ${this.objName} :`);
        }
    }

    delete(keyValue: string): void {
        let index = this.obj().findIndex((c: any) => c[this.key] === keyValue) ?? null
        if (index !== -1)
            this.obj().splice(index, 1);;
        envConfig.logLine(`just deleted ( " ${this.key} ) from ${this.objName} :`);
    }

}
class RouteSvc extends SvcInstance<IDefaultRoutesConfig> implements IRouteSvc {
    constructor() {
        super('routeName')
    }

    deleteAppRoute(routePath: string) { // '/roles'
        let self = this;
        this.routesLoop(routePath, function (item: any, index: number) {
            appRouter.stack.splice(index, 1);
            let msg =`route deleted : ${self.getMethod(item.route)} : ${item.route.path} `
            envConfig.logLine(msg)
        })

    }
    getRoutesToString(routeName: string): string {
        let result = this.getAppRoutes(routeName)
            .map((r: any) => this.getMethod(r).padEnd(7) + " : " + r.path)
            .join("\n");

        return result;
    }
    getRoutesToJsonString(routeName: string): string {
        let result = this.getAppRoutes(routeName)
            .map((r: any) => {
                return {
                    method: this.getMethod(r),
                    path: r.path
                };
            });

        return JSON.stringify(result, null, 2);
    }

    getAllRoutesToString() {
        let result = appRouter.stack.filter((r: any) => r.route)
            .map((r: any) => this.getMethod(r.route).padEnd(7) + r.route.path).join("\n");

        console.log('================= All Routes avaliable ================ \n' + result)
        return result;
    }
    getAllRoutesToJsonString() {
        let result = appRouter.stack.filter((r: any) => r.route)
            .map((r: any) => {
                return {
                    method: this.getMethod(r.route),
                    path: r.route.path
                };
            });
        console.log('================= All Routes avaliable ================ \n' + JSON.stringify(result, null, 2))
       return result;
    }

    pluralizeRoute(routeName: string) {
        routeName = routeName.toLowerCase();
        if (routeName.indexOf('/') == -1) {
            return ('/' + pluralize(routeName));
        } else {
            return routeName;
        }
    }

    private getAppRoutes(routePath: string): IRoute[] {
        return appRouter.stack.filter((r: any) => r.route && r.route.path.startsWith(routePath)).map((r: any) => r.route)
    }

    private getMethod(routeObj: any) {
        return  Object.keys(routeObj.methods)[0].toUpperCase()
    }
    private routesLoop(routePath: string, callback: (item: any, index: number) => void) { // '/roles'
        const len = appRouter.stack.length;
        for (let index = 0; index < len; index++) {
            let item = appRouter.stack[index];
            if (item && item.route.path.startsWith(routePath)) {
                callback(item, index)
            }
        }

    }
}
class Svc implements ISvc {

    db: ISvcIntance<IDbModel>
    routes: IRouteSvc
    constructor() {
        this.db = new SvcInstance('name');
        this.routes = new RouteSvc();
    }

}

export default new Svc();