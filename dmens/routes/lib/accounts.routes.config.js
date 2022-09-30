import { DefaultController } from '../../controllers/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';
import { dbStore } from '../../common/index.js';
export async function AccountsRoutes(app) {
    return dbStore['account'] ? await Promise.resolve(await DefaultRoutesConfig.instance(app, 'account', await DefaultController.createInstance('account'), (self) => {
        self.defaultRoutes();
        self.param();
    })) : console.log('Account model is not avaliable in dbStore No accounts routes configuered');
}
