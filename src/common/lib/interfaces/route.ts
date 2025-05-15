import { IRoute, IRouter } from "express";
import { IMethod, IRequestVerpsAsync } from "./types.js";
import { IConfigration } from "./config.js";
import { IController } from "./controller.js";
import { IActiveRoutes } from "./common.js";

// function with parmeters interface 
export interface IRouteCallback {
  (this: IDefaultRoutesConfig): void;
}

export interface IRouteManager {
  router: IRouter;
  config: IDefaultRoutesConfig;

  print(name?: string): void;
  getRoutes(): IRoute[];
  getRoutesPathMethods(routeName?: string): { method: string; path: string }[];

  removeAllRoutes(): void;
  removeRoutePath(routePath: string, method: IMethod): void;

  routesToString(): string;
  routesToJson(): string;
}

export interface IDefaultRoutesConfig {
  router: IRouter;
  config: IConfigration;
  controller: IController;
  baseRoute: string;
  paramId: string;
  activeRoutes: IActiveRoutes;
  routeManager: IRouteManager;

  addOptions(path?: string): void;
  addRoute(method: IMethod, path?: string, action?: string, middlewares?: string[]): Promise<void>;
  addRoutePath(method: IMethod, path?: string): string;
  setMiddlewars(action: string, middlewares?: string[]): Promise<any[]>;
  addEndPoints(): Promise<void>;

  setParam(paramId: string): void;
  defaultRoutes(): Promise<any>;
  actions(actionName: string): IRequestVerpsAsync;
}
