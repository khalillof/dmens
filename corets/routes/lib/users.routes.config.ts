import { UsersController } from '../../controllers';
import { DefaultRoutesConfig } from './default.routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { dbStore } from '../../common/customTypes/types.config';



export async function UsersRoutes() {
    return dbStore['user'] ? await Promise.resolve(await DefaultRoutesConfig.instance('/users', await UsersController.createInstance('user'),
    (self:DefaultRoutesConfig)=>{
        self.router.all('/users',self.corsWithOption);
        self.router.post('/users/signup',
            self.UsersMWare.validateRequiredUserBodyFields,
            self.actions('signup')
            );
        
        self.router.post('/users/login',
            self.UsersMWare.validateRequiredUserBodyFields,
            self.actions('login')
            );

        self.router.get('/users/logout',self.actions('logout'));

        self.router.get('/users/profile',AuthService.authenticateUser,self.actions('profile'));

        self.router.get('/facebook/token',AuthService.authenticateFacebook,self.actions('facebook'));

        self.router.get('/users',self.UsersMWare.verifyUser,self.UsersMWare.verifyUserIsAdmin,self.actions('list')); 

        self.router.get('/users/checkJWTtoken', self.actions('checkJWTtoken') );

        self.router.param('id', self.UsersMWare.extractUserId);
       
        self.router.all('/users/id',self.UsersMWare.validateUserExists);
        self.router.get('/users/id',self.actions('getOneById'));
        self.router.delete('/users/id',self.actions('remove'));
        self.router.put('/users/id',
            self.UsersMWare.validateSameEmailBelongToSameUser,
            self.actions('put')); 
})): console.log('User model is not avaliable in dbStore No users routes configuered');
}