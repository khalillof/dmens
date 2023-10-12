import { corsWithOptions } from "./cors.config.js";
import { Svc, Assert, envs } from '../../common/index.js'
import { middlewares } from '../../middlewares/index.js';
import { IController, IDefaultRoutesConfig, IMiddlewares, IRouteCallback } from '../../interfaces/index.js';
import { DefaultController } from '../../controllers/index.js';
import { appRouter } from '../../app.js'



export class DefaultRoutesConfig implements IDefaultRoutesConfig {
  router: any
  routeName: string;
  routeParam: string;
  controller: IController;
  mware?: IMiddlewares;

  constructor(controller: IController, callback?: IRouteCallback) {
    if (!(controller instanceof DefaultController)) {
      envs.throwErr('route configration require instance of class DefaultController')
    }
    this.controller = controller
    this.router = appRouter;

    this.routeName = this.controller.db.config.routeName;
    this.routeParam = this.routeName + '/:id';
    this.mware = middlewares;

    typeof callback === 'function' ? callback.call(this) : this.defaultRoutes();

    // add instance to routeStore
    Svc.routes.add(this);
    // this.app.use(this.router)
  }


  // custom routes
  async buidRoute(routeName: string, method: string, actionName?: string | null, middlewares: string[] = []) {
    if (!routeName)
      throw new Error('buildRoute method require url or routeName')
    
    // add auth methods to the end of middlewares
    middlewares = [...middlewares,...this.controller?.db.config.checkAuth!(method ?? actionName)]

    // map middlewares string fuction names to actual functions
    let mdwrs: any = this.mware!;
    let mdwares: Function[] = middlewares.map((m) => mdwrs[m]);

    return this.router[((method === 'list') ? 'get' : method)](routeName, ...mdwares, this.actions(actionName ?? method))
  }

  setOptions(routPath: string) {
    this.router.options(routPath, corsWithOptions);
  }
  options() {
    this.setOptions(this.routeName);
    this.setOptions(this.routeParam);
  }
  param() {
    return this.router.param('id', async (req: any, res: any, next: any, id: string) => {
      try {
        Assert.idString(id);
        next()
      } catch (err: any) {
        res.json({ success: false, error: err.message })
        envs.logLine(err.stack)
      }
    });
  }
  async defaultRoutes() {

    await this.buidRoute(this.routeName + '/search', 'list', 'search');// search
    await this.buidRoute(this.routeName + '/count', 'list', 'count'); // count
    await this.buidRoute(this.routeName + '/form', 'list', 'form'); // get form elements
    await this.buidRoute(this.routeName + '/route', 'list', 'route'); // get form elements
    await this.buidRoute(this.routeName, 'list', 'list'); // list
    await this.buidRoute(this.routeParam, 'get', 'getOne') // get By id
    await this.buidRoute(this.routeName, 'get', 'getOne') // getOne by filter parameter
    await this.buidRoute(this.routeName, 'post', null, this.controller?.db.config.middlewares)// post
    await this.buidRoute(this.routeParam, 'put', null, this.controller?.db.config.middlewares)// put

    await this.buidRoute(this.routeParam, 'delete', null, ['validateCurrentUserOwnParamId'])// delete

    this.param();
    this.options();
  }

  actions(actionName: string) {
    return this.controller!.tryCatch(actionName)
  }
}