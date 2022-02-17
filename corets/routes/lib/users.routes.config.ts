import { UsersController } from '../../controllers';
import { DefaultRoutesConfig } from './default.routes.config';
import{AuthService} from '../../auth/services/auth.service';

export async function UsersRoutes() {
    return await DefaultRoutesConfig.instance('/users', await UsersController.createInstance(), 
    function(self:DefaultRoutesConfig){
              
        self.router.post('/users/signup',
            self.corsWithOption,
            self.UsersMWare.validateRequiredUserBodyFields,
            self.controller.signup(self.controller)
            );
        
        self.router.post('/users/login',
            self.corsWithOption,
            self.UsersMWare.validateRequiredUserBodyFields,
            self.controller.login(self.controller)
            );

        self.router.get('/users/logout',
            self.corsWithOption,
            self.UsersMWare.validateRequiredUserBodyFields,
            self.controller.logout
            );

            self.router.get('/users/profile',
            self.corsWithOption,
            AuthService.authenticateUser,
            self.controller.profile);

        self.router.get('/facebook/token',
                self.corsWithOption,
                AuthService.authenticateFacebook,
                self.controller.facebook);

        self.router.get('/users',
               self.cors,self.corsWithOption, 
               self.UsersMWare.verifyUser,
               self.UsersMWare.verifyUserIsAdmin,
            self.actions('list')); 

        self.router.get('/users/checkJWTtoken',
        self.corsWithOption,
        self.controller.checkJWTtoken(self.controller)
        );

        self.router.param('id', self.UsersMWare.extractUserId);
       
        self.router.all('/users/id',self.UsersMWare.validateUserExists(self.UsersMWare.controller));
        self.router.get('/users/id',self.actions('getById'));
        self.router.delete('/users/id',self.actions('remove'));
        self.router.put('/users/id',
            self.UsersMWare.validateSameEmailBelongToSameUser(self.UsersMWare.controller),
            self.actions('put')); 
});
}