
const { DefaultController } =require('../../controllers/lib/default.controller');
const fs =require('fs');
const path =require( 'path');


const upload_url = path.resolve(__dirname, '../../models/schema/uploads');

class SchemaController extends DefaultController {

    constructor() {
        super('schema')
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

            fs.writeFile(filepath, jsonContent, 'utf8', function (err) {
                if (err) {
                    console.log(err);
                    res.json({ success: false, message: 'operation faild' })
                } else {
                    console.log('wrote new file to :' + filepath);
                    res.json({ success: true, message: 'operation successfull' })
                }

            });

        }
        else if (req.file) {
            let file = req.file;
            console.log("json file saved on :" + file.path);
            res.json({ success: true, message: 'operation successfully executed' })
        } else {
            res.json({ success: false, message: 'operation unsuccessfull, expected json file' })
        }
    });
    }


    static async createInstance() {
        return await Promise.resolve(new SchemaController());
    }
}

exports.SchemaController = SchemaController;