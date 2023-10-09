import { ConfigProps } from '../../models/index.js';
import { AuthController } from '../../controllers/index.js';
import { IDefaultRoutesConfig, IRouteConfigCallback } from '../../interfaces/index.js';

// auth routes 
export const AuthRoutes: IRouteConfigCallback = {
    config: new ConfigProps({name:'auth', active:true,schemaObj:{},routeName:'auth'}),
    controller: ()=> new AuthController(),
    routeCallback: function (this: IDefaultRoutesConfig): void {
        this.router.post('/auth/signup', this.mware!.checkLoginUserFields, this.actions('signup'));
        this.router.post('/auth/signin', this.mware!.checkLoginUserFields, this.actions('signin'));
        this.router.get('/auth/logout', this.actions('logout'));
        //this.router.get('/auth/facebook/token', this.authenticate('facebook'), this.actions('facebook'));

        this.router.get('/auth/profile/:id', this.authenticate("jwt"), this.mware!.validateCurrentUserOwnParamId, this.actions('findById'));
        this.router.delete('/auth/profile/:id', this.authenticate("jwt"), this.mware!.validateCurrentUserOwnParamId, this.actions('remove'));
        this.router.put('/auth/profile/:id', this.authenticate("jwt"), this.mware!.validateCurrentUserOwnParamId, this.actions('put'));
        // get secrets form envirmoment variables
        this.router.get('/auth/secure', this.authenticate("jwt"), this.mware!.isInRole('admin'), this.actions('secure'));

        this.param()
        // get profile require query string eg ==>  /auth/profile?email=user@user.co
        this.router.get('/auth/profile', this.authenticate("jwt"), this.mware!.validateHasQueryEmailBelongToCurrentUser, this.actions('profile'));

        this.param();
        this.options();


    }
}
