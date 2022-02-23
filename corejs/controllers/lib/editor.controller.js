
const { DefaultController } =require('./default.controller');
const fs =require('fs');
const path =require( 'path');


const upload_url = path.resolve(__dirname, '../../models/schema/uploads');

 class EditorController extends DefaultController {

    constructor() {
        super('editor')
    }

    static async createInstance() {
        return await Promise.resolve(new EditorController());
    }

    pre(req, res, next) {

        let content = req.header('content-type');

        if (content === 'application/json') { //if(content.startsWith('multipart/form-data'))
            let content = req.body;
            req.body = {};
            req.body.json = content;
            this.schema(req, res, next)
        } else {
            next()
        }
    }
    // was moved here to resolve the issue of module exports inside circular dependency between DefaultController and DefaultRoutesConfig
    async schema(req, res, next) {
        this.tryCatchRes(res, ()=>{
            if (req.body.json) {
                let filepath = path.join(upload_url + 'schema.' + Date.now() + '.json');
    
                //stringify JSON Object
                let jsonContent = JSON.stringify(req.body.json);
    
                fs.writeFile(filepath, jsonContent, 'utf8', this.callBack(res).errSuccess);
            }
            
            this.resObjSuccessErr(res,req.file)
        });
    }

}

exports.EditorController = EditorController;