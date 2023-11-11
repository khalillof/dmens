import { corsWithOptions } from "./cors.config.js";
import { Svc, Assert, envs } from '../../common/index.js'
import { middlewares } from '../../middlewares/index.js';
import { IConfigProps, IController, IDefaultRoutesConfig, IMiddlewares, IRouteCallback } from '../../interfaces/index.js';
import { DefaultController } from '../../controllers/index.js';
import { appRouter } from '../../app.js'


//const isDefaultActions = (action: string) => ['get', 'post', 'put', 'delete', 'search', 'count', 'form', 'route', 'modeldata'].indexOf(action) !== -1;

export class DefaultRoutesConfig implements IDefaultRoutesConfig {
  router: any
  config: IConfigProps
  controller: IController
  mware?: IMiddlewares
  baseRoutePath:string
  baseRouteParam:string
  constructor(controller: IController, callback?: IRouteCallback) {
    if (!(controller instanceof DefaultController)) {
      envs.throwErr('route configration require instance of class DefaultController')
    }

    this.controller = controller
    this.config = controller.db.config;
    this.baseRoutePath = controller.db.config.modelData.baseRoutePath;
    this.baseRouteParam = controller.db.config.modelData.routeParam;
    this.router = appRouter;
    this.mware = middlewares;

    typeof callback === 'function' ? callback.call(this) : this.defaultRoutes();

    // add instance to routeStore
    Svc.routes.add(this);

  }

  addPath(name: string, param?: boolean): string {
    if (param)
      return this.baseRouteParam + (name.startsWith('/') ? name : '/' + name);
    return this.baseRoutePath + (name.startsWith('/') ? name : '/' + name);
  }
  // custom routes
  async buidRoute(route_path: string, method: string, actionName?: string | null, middlewares: string[] = []) {
    if (!route_path)
      throw new Error('buildRoute method require url or routeName')


    // remove diplicates
    middlewares = Array.from(new Set([...middlewares, ...this.config.authAdminMiddlewares!(actionName ?? 'No')]));

    let mdwrs: any = this.mware!;
    // map middlewares string fuction names to actual functions
    let mdwares: Function[] = middlewares.map((m) => mdwrs[m]);

    //if (this.config.name === 'account')
    //  console.log(`${actionName} = ${method} = ${mdwares.length}  : ${middlewares}`)

    return this.router[method](route_path, ...mdwares, this.actions(actionName ?? method))
  }

  setOptions(routPath: string) {
    this.router.options(routPath, corsWithOptions);
  }
  options() {
    this.setOptions(this.baseRoutePath);
    this.setOptions(this.baseRouteParam);
  }
  setParam() {
    return this.router.param(this.config.modelData.paramId, async (req: any, res: any, next: any, id: string) => {
      try {
        Assert.idString(id);
        next()
      } catch (err: any) {
        res.json({ success: false, error: err.message })
        envs.logLine(err.stack)
      }
    });
  }

  async defaultClientRoutes() { // routedata

    await this.buidRoute(this.addPath('/search'), 'get', 'search');// search
    await this.buidRoute(this.addPath('/count'), 'get', 'count'); // count
    await this.buidRoute(this.addPath('/form'), 'get', 'form'); // get form elements
    await this.buidRoute(this.addPath('/route'), 'get', 'route'); // get form routes
    await this.buidRoute(this.addPath('/modeldata'), 'get', 'modeldata'); // get model routeData
  }
  async defaultRoutes() { // routedata
    await this.defaultClientRoutes()

    await this.buidRoute(this.baseRoutePath, 'get', 'list'); // list   
    await this.buidRoute(this.addPath('/one'), 'get', 'getOne') // getOne by filter parameter
    await this.buidRoute(this.baseRouteParam, 'get', 'getOne') // get by id
    await this.buidRoute(this.addPath('/create'), 'post', 'post',this.config.postPutMiddlewares)// post
    await this.buidRoute(this.addPath('/edit', true), 'put', 'put', this.config.postPutMiddlewares)// put
    await this.buidRoute(this.addPath('/delete', true), 'delete', 'delete', ['validateCurrentUserOwnParamId'])// delete

    this.setParam();
    this.options();
  }

  actions(actionName: string) {
    return this.controller!.tryCatch(actionName)
  }
}