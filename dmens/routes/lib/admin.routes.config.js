import { AdminController } from '../../controllers/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';
import { dbStore } from '../../common/index.js';
import { uploadSchema } from './uploads.js';
export async function AdminRoutes(app) {
    return dbStore['account'] ? await Promise.resolve(await DefaultRoutesConfig.instance(app, 'admin', await AdminController.createInstance('admin'), (self) => {
        self.defaultRoutes();
        self.post([uploadSchema]);
    })) : console.log('Account model is not avaliable in dbStore No Schema routes configuered');
    ;
}
;
