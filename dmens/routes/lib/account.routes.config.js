import { AccountController } from '../../controllers/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';
// auth routes 
export async function AccountRoutes() {
    return new DefaultRoutesConfig(new AccountController(), async function () {
        await this.defaultClientRoutes();
        await this.buidRoute(this.addPath('/signup'), 'post', 'signup', ['checkLoginUserFields']);
        await this.buidRoute(this.addPath('/signin'), 'post', 'signin', ['checkLoginUserFields']);
        await this.buidRoute(this.addPath('/logout'), 'get', 'logout');
        // get secrets form envirmoment variables
        await this.buidRoute(this.addPath('/secure'), 'get', 'secure', ['authenticate', 'isAdmin']);
        await this.buidRoute(this.baseRouteParam, 'get', 'findById', ['validateCurrentUserOwnParamId', 'authenticate']);
        await this.buidRoute(this.baseRouteParam, 'delete', 'delete', ['validateCurrentUserOwnParamId', 'authenticate']);
        await this.buidRoute(this.baseRouteParam, 'put', 'put', ['validateCurrentUserOwnParamId', 'authenticate']);
        // get profile require query string eg ==>  /auth/profile?email=user@user.co
        await this.buidRoute(this.baseRoutePath, 'get', 'profile', ['authenticate', 'validateHasQueryEmailBelongToCurrentUser']);
    });
}
