import { AccountController } from '../../controllers/index.js';
import { IDefaultRoutesConfig } from '../../interfaces/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';

// auth routes 
export async function AccountRoutes() {
  return new DefaultRoutesConfig(new AccountController(),
   async function (this: IDefaultRoutesConfig) {
    await  this.defaultExtraRoutes()

    await  this.post(this.config.routeName+'/signup', 'signup', ['checkLoginUserFields'])
    await   this.post(this.config.routeName+'/signin', 'signin', ['checkLoginUserFields'])
    await   this.get(this.config.routeName+'/logout',  'logout')
      // get secrets form envirmoment variables
    await   this.get(this.config.routeName+'/secure', 'secure', ['authenticate', 'isAdmin']);

    await   this.get(undefined, undefined, ['validateCurrentUserOwnParamId', 'authenticate']);
    await   this.delete(undefined, undefined, ['validateCurrentUserOwnParamId', 'authenticate']);
    await   this.update(undefined, undefined, ['validateCurrentUserOwnParamId', 'authenticate']);
      // get profile require query string eg ==>  /auth/profile?email=user@user.co
    await   this.get(`${this.config.routeName}/profile/${this.config.name+'Id'}`, 'profile', ['authenticate', 'validateHasQueryEmailBelongToCurrentUser']);
    await this.list(); // all acounts
  }
  )
}
