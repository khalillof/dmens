import { IModelDb, IDefaultRoutesConfig, IStore, IStoreIntance, IRouteStore } from "../../interfaces/index.js";
import { envs } from "../../common/index.js";
import { dbStore, routeStore } from "../../common/lib/helpers.js";
import { appRouter } from '../../index.js'
import pluralize from '../../common/lib/pluralize.js';
import { IRoute } from "express";

class StoreInstance<T> implements IStoreIntance<T> {

    storeKey: string
    storeName: string
    store: T[]
    constructor(key: "name" | "routeName") {
        this.storeKey = key;
        this.storeName = key === 'name' ? "dbStore" : "routrStore";
        this.store = this.storeKey === "name" ? dbStore as T[] : routeStore as T[]
    }

    len(): number {
        return this.store.length;
    }
    exist(keyValue: string): boolean {
        return this.get(keyValue) !== null;
    }
    get(keyValue: string): T | null {
        return this.store.find((c: any) => c[this.storeKey] === keyValue) ?? null 
    }

    add(obj: T | any): void {
        let keyValue = obj[this.storeKey];
        if (!this.exist(keyValue)) {
            this.store.push(obj);
            envs.logLine(`just added ( " ${keyValue} " ) to ${this.storeName} :`);
        }
    }

    delete(keyValue: string): void {
        if(this.exist(keyValue)){
        let index = this.store.findIndex((c: any) => c[this.storeKey] === keyValue) ?? null
        if (index !== -1)
            this.store.splice(index, 1);;
        envs.logLine(`just deleted ( " ${this.storeKey} ) from ${this.storeName} :`);
       }
    }

}

class RouteStore extends StoreInstance<IDefaultRoutesConfig> implements IRouteStore {
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
        return pluralize(routeName);
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
            if (item && item.route?.path.startsWith(routePath)) {
                callback(item, index)
            }
        }
  
    } 
}

class Store implements IStore {

    db: IStoreIntance<IModelDb>
    route: IRouteStore
    constructor() {
        this.db = new StoreInstance('name');
        this.route = new RouteStore();
    }

}

export default new Store();