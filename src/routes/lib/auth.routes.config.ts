import { ConfigProps } from '../../models/index.js';
import { AuthController } from '../../controllers/index.js';
import { IDefaultRoutesConfig, IRouteConfigCallback } from '../../interfaces/index.js';

// auth routes 
export const AuthRoutes: IRouteConfigCallback = {
    config: new ConfigProps({name:'auth', active:true,schemaObj:{},routeName:'auth'}),
    controller: ()=> new AuthController(),
    routeCallback: function (this: IDefaultRoutesConfig): void {
        this.buidRoute('/auth/signup','post', 'signup',['checkLoginUserFields'])
        this.buidRoute('/auth/signin','post', 'signin',['checkLoginUserFields'])
        this.buidRoute('/auth/logout','get', 'logout')
        this.buidRoute('/auth/profile/:id','get','findById', ['isAuthenticated', 'validateCurrentUserOwnParamId']);
        this.buidRoute('/auth/profile/:id','delete','remove', ['isAuthenticated','validateCurrentUserOwnParamId']);
        this.buidRoute('/auth/profile/:id','put','put', ['isAuthenticated','validateCurrentUserOwnParamId']);
        // get secrets form envirmoment variables
        this.buidRoute('/auth/secure','get','secure', ['isAuthenticated','isAdmin']);

        // get profile require query string eg ==>  /auth/profile?email=user@user.co
        this.buidRoute('/auth/profile','get','profile', ['isAuthenticated','validateHasQueryEmailBelongToCurrentUser']);

        this.param();
        this.options();


    }
}
