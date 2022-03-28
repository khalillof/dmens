const {EditorController} =require('../../controllers');
const {DefaultRoutesConfig} =require('./default.routes.config');
const { dbStore} =require('../../common');
const {uploadSchema} = require('./upload');


 async function EditorRoutes(exps){
    
    return dbStore['account'] ? await Promise.resolve( await DefaultRoutesConfig.instance(exps,'editor', await EditorController.createInstance('editor'), 
   function (){
let self =this;
 self.post([uploadSchema], true);
 self.getId();
 self.getList();
 self.put();
 self.delete();
 self.param();
})) : console.log('Account model is not avaliable in dbStore No Schema routes configuered');
};
exports.EditorRoutes = EditorRoutes;


