import { IRequestFilter } from "./common.js";
import { IConfigration } from "./config.js";
import { IEndPointRoute } from "./endpoint.js";
import { IModel } from "./model.js";
import { IRequestVerpsAsync } from "./types.js";

export interface IController {
  config: IConfigration;
  db: IModel;
  endPoint(host: string, route: IEndPointRoute): IRequestVerpsAsync;
  buildQuery(query: Record<string, any>): IRequestFilter;

  count: IRequestVerpsAsync;
  search: IRequestVerpsAsync;
  test: IRequestVerpsAsync;

  list: IRequestVerpsAsync;
  get: IRequestVerpsAsync;
  create: IRequestVerpsAsync;
  update: IRequestVerpsAsync;
  delete: IRequestVerpsAsync;
}

export interface IConfigController extends IController {
  metadata: IRequestVerpsAsync;
  viewdata: IRequestVerpsAsync;
  routedata: IRequestVerpsAsync;
  routes: IRequestVerpsAsync;
  routesdata: IRequestVerpsAsync;

  addRoute: IRequestVerpsAsync;
  removeRoute: IRequestVerpsAsync;

  enableRoutes: IRequestVerpsAsync;
  disableRoutes: IRequestVerpsAsync;
}
