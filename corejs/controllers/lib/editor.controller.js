
const { DefaultController } = require('./default.controller');
const fs = require('fs');
const {config} = require('../../common')
const { JsonLoad } = require('../../models')

class EditorController extends DefaultController {

    constructor(name = 'editor') {
        super(name)
    }
  async schemaDataHandller(req,res,next, data){
        let jsonObj = await JsonLoad.makeSchema({name :data.name,schema :data}, true);
        jsonObj.schema.editor = req.user._id;
        // to save as file later
        let objForFileCopy = jsonObj;

        //stringify JSON schema feild to save on db
        jsonObj.schema.data = JSON.stringify(jsonObj.schema.data);

        // assign validated json object to body for process & save by supper create method
        req.body = jsonObj.schema;
        await super.create(req, res, next);

        return objForFileCopy
    }
    saveJsnoToFile(jsonObject,stringify=true){
                //stringify jsonContent 
                if(stringify) 
                jsonObject = JSON.stringify(jsonObject)

                let file_path = config.getSchemaUploadPath();
                fs.writeFile(file_path, jsonObject, 'utf8',(err)=>{
                err ? this.logError(err):this.log('New json file document created path: '+file_path)
                }); 
    }
    // was moved here to resolve the issue of module exports inside circular dependency between DefaultController and DefaultRoutesConfig
    async create(req, res, next) {
        if (req.header('content-type') ==='application/json' && req.body) {
                // to save as file later
                let fileDataCopy = await this.schemaDataHandller(req,res,next,req.body);

                // save data to file
                this.saveJsnoToFile(fileDataCopy); 

        } else if(req.file) {

            fs.readFile(req.file.path, 'utf8', async (err, data)=> {
                if (err) {
                    this.resErrIfErr(res,err);
                }else {
                     await this.schemaDataHandller(req,res,next,JSON.parse(data))
                    }
              });
        }else{
            
            this.resError(res,'content must be valid json');
        }

    }

}

exports.EditorController = EditorController;