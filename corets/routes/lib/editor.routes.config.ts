import {EditorController} from '../../controllers';
import {DefaultRoutesConfig} from './default.routes.config'
import { dbStore} from '../../common/customTypes/types.config';
import {uploadSchema} from './uploads';
export async function EditorRoutes(){
    
    return dbStore['user'] ? await Promise.resolve( await DefaultRoutesConfig.instance('editor', await EditorController.createInstance('editor'), 
    (self:DefaultRoutesConfig):void=>{

 self.post([uploadSchema], false);
 self.getId();
 self.getList();
 self.put();
 self.delete()
})) : console.log('User model is not avaliable in dbStore No Schema routes configuered');;
};

