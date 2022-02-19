import { UsersController } from '../../controllers';
import { DefaultRoutesConfig } from './default.routes.config';
import { AuthService } from '../../auth/services/auth.service';
import path from 'path';
import multer from 'multer';
const upload_url = path.resolve(__dirname,'../../models/schema/uploads');
const upload = multer({
    dest: upload_url,
    limits: { fieldNameSize: 30, fieldSize: 1048576, fields: 0, fileSize: 1048576, files: 1, headerPairs: 20 },
    fileFilter: (req, file, cb) => file.mimetype === 'application/json' && path.extname(file.originalname) === '.json' ? cb(null, true) : cb(null, false),
    storage: multer.diskStorage(
        {
            destination: (req, file, cb) => cb(null,upload_url),
            filename: (req, file, cb) => cb(null, file.fieldname + '.' + Date.now() + path.extname(file.originalname)) 
        })
});


export async function UsersRoutes() {
    return await DefaultRoutesConfig.instance('/users', await UsersController.createInstance(),
        function (self: DefaultRoutesConfig) {
            self.router.all('/users', self.corsWithOption);
            self.router.post('/users/signup',
                self.UsersMWare.validateRequiredUserBodyFields,
                self.actions('signup')
            );

            self.router.post('/users/login',
                self.UsersMWare.validateRequiredUserBodyFields,
                self.actions('login')
            );

            self.router.get('/users/logout',
                self.UsersMWare.validateRequiredUserBodyFields,
                self.actions('logout')
            );

            self.router.post('/users/schema',
                (req, res, next) => {

                    let content = req.header('content-type');

                    if (content === 'application/json') { //if(content.startsWith('multipart/form-data'))
                        let content = req.body;
                        req.body = {};
                        req.body.json = content;
                        self.actions('schema')(req, res, next)
                    } else {
                        next()
                    }
                },
                upload.single('schema'), self.actions('schema')
            );

            self.router.get('/users/profile', AuthService.authenticateUser, self.actions('profile'));

            self.router.get('/facebook/token', AuthService.authenticateFacebook, self.actions('facebook'));

            self.router.get('/users', self.UsersMWare.verifyUser, self.UsersMWare.verifyUserIsAdmin, self.actions('list'));

            self.router.get('/users/checkJWTtoken',
                self.actions('checkJWTtoken')
            );

            self.router.param('id', self.UsersMWare.extractUserId);

            self.router.all('/users/id', self.UsersMWare.validateUserExists(self.UsersMWare.controller));
            self.router.get('/users/id', self.actions('getById'));
            self.router.delete('/users/id', self.actions('remove'));
            self.router.put('/users/id',
                self.UsersMWare.validateSameEmailBelongToSameUser(self.UsersMWare.controller),
                self.actions('put'));
        });
}