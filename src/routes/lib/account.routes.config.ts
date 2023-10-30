import { AccountController } from '../../controllers/index.js';
import { IDefaultRoutesConfig } from '../../interfaces/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';

// auth routes 
export async function AccountRoutes() {
  return new DefaultRoutesConfig(new AccountController(),
    function (this: IDefaultRoutesConfig): void {
      this.buidRoute(this.addRoutePath('/signup'), 'post', 'signup', ['checkLoginUserFields'])
      this.buidRoute(this.addRoutePath('/signin'), 'post', 'signin', ['checkLoginUserFields'])
      this.buidRoute(this.addRoutePath('/logout'), 'get', 'logout')
      // get secrets form envirmoment variables
      this.buidRoute(this.addRoutePath('/secure'), 'get', 'secure', ['authenticate', 'isAdmin']);

      this.buidRoute(this.config.routeParam, 'get', 'findById', ['validateCurrentUserOwnParamId', 'authenticate']);
      this.buidRoute(this.config.routeParam, 'delete', 'remove', ['validateCurrentUserOwnParamId', 'authenticate']);
      this.buidRoute(this.config.routeParam, 'put', 'put', ['validateCurrentUserOwnParamId', 'authenticate']);
      // get profile require query string eg ==>  /auth/profile?email=user@user.co
      this.buidRoute(this.config.routeName, 'get', 'profile', ['authenticate', 'validateHasQueryEmailBelongToCurrentUser']);

      this.defaultRoutes()
    }
  )
}
