import express from 'express';
import { DefaultController } from '../../controllers';
import fs from 'fs';
import path from 'path'
import { JsonLoad } from '../../models/json.load';
const upload_url = path.resolve(__dirname, '../../models/schema/uploads');
// 
export class EditorController extends DefaultController {

    constructor(name ='editor') {
        super(name)
    }
    
    // was moved here to resolve the issue of module exports inside circular dependency between DefaultController and DefaultRoutesConfig
    async create(req: express.Request, res: express.Response, next: express.NextFunction) {

        if (req.header('content-type') ==='application/json') {

            await this.tryCatchRes(res, async () => {
                // validated json obj
                let jsObj = await JsonLoad.makeSchema({name :req.body.name,schema :req.body}, true);
                let filepath = path.join(upload_url + 'editors/schema.' + Date.now() + '.json');
                let user : any = req.user;
                jsObj.schema.editor =  user._id;

                //stringify JSON schema
                jsObj.schema.data = JSON.stringify(jsObj.schema.data);
                
                // assign validated json object to body for process & save by supper create method
                req.body = jsObj.schema;
                await super.create(req, res, next);

                 // for file save
                 let jsonContent = JSON.stringify(jsObj)
                fs.writeFile(filepath, jsonContent, 'utf8', this.callBack(res).errSuccess);
                this.log('all the way up to the buttom of the function')
            });


        } else if(req.file) {
            this.resObjSuccessErr(res, req.file);
        }else{
            this.resError(res);
        }
    } 
}