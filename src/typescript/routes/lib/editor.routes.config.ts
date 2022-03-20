import {EditorController} from '../../controllers';
import {DefaultRoutesConfig} from './default.routes.config'
import { dbStore} from '../../common';
import {uploadSchema} from './uploads';
export async function EditorRoutes(){
    
    return dbStore['account'] ? await Promise.resolve( await DefaultRoutesConfig.instance('editor', await EditorController.createInstance('editor'), 
    (self:DefaultRoutesConfig):void=>{

 self.post([uploadSchema], true);
 self.getId();
 self.getList();
 self.put();
 self.delete();
 self.param()
})) : console.log('Account model is not avaliable in dbStore No Schema routes configuered');;
};

