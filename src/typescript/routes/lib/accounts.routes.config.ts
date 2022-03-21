import { AccountsController } from '../../controllers';
import { DefaultRoutesConfig } from './default.routes.config';
import { dbStore } from '../../common';



export async function AccountsRoutes() {
    return dbStore['account'] ? await Promise.resolve(await DefaultRoutesConfig.instance('account', await AccountsController.createInstance('account'),
    (self:DefaultRoutesConfig)=>{

        self.router.all('/accounts',self.corsWithOption);
        self.router.post('/accounts/signup',
            self.mWares!.validateRequiredUserBodyFields,
            self.actions('signup')
            );
        
        self.router.post('/accounts/login',
            self.mWares!.validateRequiredUserBodyFields,
            self.actions('login')
            );

        self.router.get('/accounts/logout',self.actions('logout'));

        self.router.get('/accounts/profile',self.mWares!.auth.authenticateUser("jwt"),self.actions('profile'));

        self.router.get('/facebook/token',self.mWares!.auth.authenticateUser("facebook"),self.actions('facebook'));

        self.router.get('/accounts',self.mWares!.isAuthenticated,self.mWares!.isAdmin,self.actions('list')); 

        //self.router.param('id', self.accountsMWare!.extractUserId);
       self.param()
        self.router.all('/accounts/id',self.mWares!.userExist);
        self.router.get('/accounts/id',self.mWares!.isAuthenticated,self.actions('getOneById'));
        self.router.delete('/accounts/id',self.mWares!.isAuthenticated, self.mWares!.validateSameEmailBelongToSameUser, self.actions('remove'));
        self.router.put('/accounts/id',
            self.mWares!.validateSameEmailBelongToSameUser,
            self.actions('put')); 
})): console.log('Account model is not avaliable in dbStore No accounts routes configuered');
}