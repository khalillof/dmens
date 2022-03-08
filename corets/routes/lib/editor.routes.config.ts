import {EditorController} from '../../controllers';
import {DefaultRoutesConfig} from './default.routes.config'
import { dbStore} from '../../common/customTypes/types.config';
import path from 'path'
import multer from 'multer';
import {config} from '../../bin/config'

const upload = multer({
    dest: config.jsonUploadDir,
    limits: { fieldNameSize: 30, fieldSize: 1048576, fields: 0, fileSize: 1048576, files: 1, headerPairs: 20 },
    fileFilter: (req, file, cb) => file.mimetype === 'application/json' && path.extname(file.originalname) === '.json' ? cb(null, true) : cb(null, false),
    storage: multer.diskStorage(
        {
            destination: (req, file, cb) => cb(null,config.jsonUploadDir),
            filename: (req, file, cb) => cb(null, file.fieldname + '.' + Date.now() + path.extname(file.originalname)) 
        })
});


export async function EditorRoutes(){
    
    return dbStore['user'] ? await Promise.resolve( await DefaultRoutesConfig.instance('editor', await EditorController.createInstance('editor'), 
    (self:DefaultRoutesConfig):void=>{

 //self.router.post('/editor',self.corsWithOption, upload.single('schema'), self.actions('schema'));
 self.post([upload.single('schema')], false);
 self.getId();
 self.getList();
 self.put();
 self.delete()
})) : console.log('User model is not avaliable in dbStore No Schema routes configuered');;
};

