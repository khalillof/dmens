import { AccountController } from '../../controllers/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';
// auth routes 
export async function AccountRoutes() {
    return new DefaultRoutesConfig(new AccountController(), function () {
        this.buidRoute(this.routeName + '/signup', 'post', 'signup', ['checkLoginUserFields', 'authenticate']);
        this.buidRoute(this.routeName + '/signin', 'post', 'signin', ['checkLoginUserFields', 'authenticate']);
        this.buidRoute(this.routeName + '/logout', 'get', 'logout');
        this.buidRoute(this.routeParam, 'get', 'findById', ['isAuthenticated', 'validateCurrentUserOwnParamId']);
        this.buidRoute(this.routeParam, 'delete', 'remove', ['isAuthenticated', 'validateCurrentUserOwnParamId']);
        this.buidRoute(this.routeParam, 'put', 'put', ['isAuthenticated', 'validateCurrentUserOwnParamId']);
        // get secrets form envirmoment variables
        this.buidRoute(this.routeName + '/secure', 'get', 'secure', ['isAuthenticated', 'isAdmin']);
        // all accounts
        this.buidRoute(this.routeName, 'list', 'list', ['isAuthenticated', 'isAdmin']);
        // get profile require query string eg ==>  /auth/profile?email=user@user.co
        this.buidRoute(this.routeName, 'get', 'profile', ['isAuthenticated', 'validateHasQueryEmailBelongToCurrentUser']);
        this.buidRoute(this.routeName + '/search', 'list', 'search', ['isAuthenticated', 'isAdmin']); // search
        this.buidRoute(this.routeName + '/count', 'list', 'count', ['isAuthenticated', 'isAdmin']); // count
        this.buidRoute(this.routeName + '/form', 'list', 'form'); // get form elements
        this.buidRoute(this.routeName + '/route', 'list', 'route'); // get form elements
        this.param();
        this.options();
    });
}
