import { IModelDb, IDefaultRoutesConfig, ISvc, ISvcIntance, IRouteSvc } from "../../interfaces/index.js";
import { envs } from "../../common/index.js";
import { dbStore, routeStore } from "../../common/lib/helpers.js";
import { appRouter } from '../../app.js'
import pluralize from '../../common/lib/pluralize.js';
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
            envs.logLine(`just added ( " ${obj[this.key]} " ) to ${this.objName} :`);
        }
    }

    delete(keyValue: string): void {
        let index = this.obj().findIndex((c: any) => c[this.key] === keyValue) ?? null
        if (index !== -1)
            this.obj().splice(index, 1);;
        envs.logLine(`just deleted ( " ${this.key} ) from ${this.objName} :`);
    }

}
class RouteSvc extends SvcInstance<IDefaultRoutesConfig> implements IRouteSvc {
    constructor() {
        super('routeName')
    }

    print(){
    envs.logLine(" ***** All app routes *******: \n",this.getAllRoutesToString())
    }
    deleteAppRoute(routeName: string, ) { // '/roles'
        this.routesLoop(routeName,  (item: any, index: number)=> {
            appRouter.stack.splice(index, 1); 
            let msg =`route deleted : ${this.getMethod(item.route)} : ${item.route.path} `
            envs.logLine(msg)
        })
        
        // delete route object Default.ConfigRoute
        this.delete(routeName)
    }

    deleteRoutePath(routePath: string) { // '/roles'
        this.routesLoop(routePath,  (item: any, index: number)=> {
            if (item && item.route.path === routePath) {
                appRouter.stack.splice(index, 1); 
                let msg =`route path deleted : ${this.getMethod(item.route)} : ${item.route.path} `
                envs.logLine(msg)
            }
        })

    }

    getRoutesToString(routeName: string): string {
        return routeName ? this.ToString(this.getRoutesPathMethods(routeName)) : "";
    }
    getRoutesToJsonString(routeName: string): string {
        return routeName ? this.ToJson(this.getRoutesPathMethods(routeName)) : "";
    }
    getAllRoutesToString() {
        return this.ToString(this.getRoutesPathMethods());
    }
    getAllRoutesToJsonString() {
        return this.ToJson(this.getRoutesPathMethods());
    }

  getRoutesPathMethods(routeName?:string):{method:string,path:string}[] {
        return this.getRoutes(routeName)
            .map((route: any) => {
                return {
                    method : this.getMethod(route),
                    path: route.path
                };
            });
    }

    getRoutes(routePath?: string): IRoute[] {
        if(routePath)
         return appRouter.stack.filter((r: any) => r.route && r.route.path.startsWith(routePath)).map((r: any) => r.route)
         return appRouter.stack.filter((r: any) => r.route).map((r: any) => r.route)
    }

    pluralizeRoute(routeName: string) {
        return pluralize(routeName)
    }

    //========================================================================================

    private ToString(obj:{method:string,path:string}[]){
        return obj.map((r: any) => r.method + " => "+ r.path).join("\n");
      }
      private ToJson(obj:{method:string,path:string}[]){
              return JSON.stringify(obj, null, 2);
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

    db: ISvcIntance<IModelDb>
    routes: IRouteSvc
    constructor() {
        this.db = new SvcInstance('name');
        this.routes = new RouteSvc();
    }

}

export default new Svc();