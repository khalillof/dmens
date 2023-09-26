import { AuthController } from '../../controllers/index.js';
// auth routes 
export const AuthRoutes = {
    routeName: '/auth',
    controller: new AuthController('account'),
    routeCallback: function () {
        this.app.post('/auth/signup', this.mware.checkLoginUserFields, this.actions('signup'));
        this.app.post('/auth/signin', this.mware.checkLoginUserFields, this.actions('signin'));
        this.app.get('/auth/logout', this.actions('logout'));
        this.app.get('/auth/facebook/token', this.authenticate('facebook'), this.actions('facebook'));
        this.app.get('/auth/profile/:id', this.authenticate("jwt"), this.mware.validateCurrentUserOwnParamId, this.actions('findById'));
        this.app.delete('/auth/profile/:id', this.authenticate("jwt"), this.mware.validateCurrentUserOwnParamId, this.actions('remove'));
        this.app.put('/auth/profile/:id', this.authenticate("jwt"), this.mware.validateCurrentUserOwnParamId, this.actions('put'));
        // get secrets form envirmoment variables
        this.app.get('/auth/secure', this.authenticate("jwt"), this.mware.isInRole('admin'), this.actions('secure'));
        this.param();
        // get profile require query string eg ==>  /auth/profile?email=user@user.co
        this.app.get('/auth/profile', this.authenticate("jwt"), this.mware.validateHasQueryEmailBelongToCurrentUser, this.actions('profile'));
        //self.options('/auth/signup')
        //self.options('/auth/signin')
        //self.options('/auth/logout')
        //self.options('/auth/facebook/token')
        //self.options('/auth/profile')
        //self.options('/auth/profile/:id')
    }
};
