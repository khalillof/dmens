import express from 'express';
import { DefaultController } from '../../controllers';
import fs from 'fs';
import { JsonLoad } from '../../models/json.load';
import {config} from '../../bin/config'
// 
export class EditorController extends DefaultController {

    constructor(name ='editor') {
        super(name)
    }
    saveJsnoToFile(jsonObject:{},stringify=true){
        //stringify jsonContent 
        if(stringify) 
        jsonObject = JSON.stringify(jsonObject)

        let file_path = config.getJsonUploadPath();
        fs.writeFile(file_path, jsonObject, 'utf8',(err)=>{
        err ? this.logError(err):this.log('New json file document created path: '+file_path)
        }); 
}
    // was moved here to resolve the issue of module exports inside circular dependency between DefaultController and DefaultRoutesConfig
    async create(req: express.Request, res: express.Response, next: express.NextFunction) {

        if (req.header('content-type') ==='application/json') {
                let user : any = req.user;              

                let jsonObj = await JsonLoad.makeSchema({name :req.body.name,schema :req.body}, true);
                
                jsonObj.schema.editor = user._id;

                // to save as file later
                let fileDataCopy = jsonObj;
              
                //stringify JSON schema to save on db
                jsonObj.schema.data = JSON.stringify(jsonObj.schema.data);
                 
                // assign validated json object to body for process & save by supper create method
                req.body = jsonObj.schema;
                await super.create(req, res, next);

                // save data to file
                this.saveJsnoToFile(fileDataCopy); 

        } else if(req.file) {
            // to do - process json file
            this.resObjSuccessErr(res, req.file);
        }else{
            
            this.resError(res);
        }
    } 
}