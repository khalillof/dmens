import { IRouter } from "express";
import { envs, IDefaultRoutesConfig, IMethod, IRouteManager } from "../../common";
import { DefaultRoutesConfig } from "./default.routes.config";

export class RouteManager implements IRouteManager {
    router: IRouter
    config: IDefaultRoutesConfig

    constructor(routeConfig: IDefaultRoutesConfig) {
        if (!(routeConfig instanceof DefaultRoutesConfig))
            throw new Error('routeManager require instance of DefaultRoutesConfig');
        this.config = routeConfig;
        this.router = routeConfig.router;
    }
    print(name?: string) {
        envs.logLine(` All routes of ( ${name ?? this.config.baseRoute})  *******: \n`, this.routesToString())
    }
    removeAllRoutes() { // '/roles'
        this.print(this.config.baseRoute + ' ** will be deleted ** --')

        this.router.stack = []
        // remove active Routes from config
        for (let method of Object.keys(this.config.activeRoutes)) {
            this.config.activeRoutes[method as IMethod] = [];
        }
    }

    removeRoutePath(routePath: string, method: IMethod) { // '/accounts

        if (!this.config.activeRoutes[method].isFound(routePath)) {
            throw new Error(`routepath - <<${routePath}>> with method <<${method}>> NOT FOUND`)
        }

        this.router.stack.forEach(({route}:any, index: number)=>{
            if (route && route.path === routePath && route.methods[method]) {

                this.router.stack.splice(index, 1);
                console.log('route path deleted >>>> :\n', route)

                //===== remove from active routes 
                this.config.activeRoutes[method].deleteItemInArray(routePath);
            }
        })
         
       

    }


    routesToString(): string {
        const routes = this.getRoutesPathMethods();
        return routes.map((r: any) => r.method + " => " + r.path).join("\n");
    }
    routesToJson(): string {
        const routes = this.getRoutesPathMethods();
        return JSON.stringify(routes, null, 2);
    }


    getRoutesPathMethods(): { method: string, path: string }[] {
        return this.getRoutes()
            .map((route: any) => {
                const { path, methods } = route;
                let keys = Object.keys(methods);
                let method = (keys?.length > 0) ? keys[0].toUpperCase() : "OPTIONS"
                return {
                    method,
                    path
                };
            });
    }

    getRoutes() {
        return this.router.stack?.filter((r: any) => r.route)?.map((r: any) => r.route) ?? []
    }

}