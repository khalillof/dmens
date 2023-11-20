import { AccountController } from '../../controllers/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';
// auth routes 
export async function AccountRoutes() {
    return new DefaultRoutesConfig(new AccountController(), async function () {
        await this.defaultClientRoutes();
        await this.create(this.addPath('/signup'), 'signup', ['checkLoginUserFields']);
        await this.create(this.addPath('/signin'), 'signin', ['checkLoginUserFields']);
        await this.get(this.addPath('/logout'), 'logout');
        // get secrets form envirmoment variables
        await this.get(this.addPath('/secure'), 'secure', ['authenticate', 'isAdmin']);
        await this.get(undefined, undefined, ['validateCurrentUserOwnParamId', 'authenticate']);
        await this.delete(undefined, undefined, ['validateCurrentUserOwnParamId', 'authenticate']);
        await this.update(undefined, undefined, ['validateCurrentUserOwnParamId', 'authenticate']);
        // get profile require query string eg ==>  /auth/profile?email=user@user.co
        await this.get(this.addPath('/profile', true), 'profile', ['authenticate', 'validateHasQueryEmailBelongToCurrentUser']);
        await this.list(); // all acounts
    });
}
