"use strict";
import path from 'path';
//import fs from 'fs';
import fs from 'fs';
import mongoose from 'mongoose';
import { JsonSchema } from '../common/customTypes/types.config';
import { JsonModel} from './json.model';

export class JsonLoad {

    constructor(directoryPath?:string, filePath?:string, callback?:any) {
        if (directoryPath) {
            this.loadDirectory(directoryPath)
        } else if (filePath && typeof callback === 'function') {
            this.loadCustomFile(filePath, callback)
        } else if (filePath && !callback) {
            this.loadFile(filePath)
        } else {
            // load default json directory
            this.loadDirectory(path.join(__dirname, './schema/'));
        }
    }
    static async createInstance(directoryPath?:string, filePath?:string) {
        return await Promise.resolve(new JsonLoad(directoryPath, filePath));
    }
    async loadCustomFile(filePath:string, callback?:any) {
        let sschema = await this.loadFile(filePath, true);

        if (typeof callback === 'function') {
            return await JsonModel.createInstance(sschema, callback)
        }
        return await JsonModel.createInstance(sschema);
    }
    async loadFile(filePath:string, schema_only = false) {
        if (path.isAbsolute(filePath) && path.extname(filePath) === '.json') {

            let data = await fs.promises.readFile(filePath, 'utf8');
            let jsobj = JSON.parse(data);
            if (!jsobj.name) {
                throw new Error(' jschema name is required property')
            }
            return await this.makeSchema(jsobj, schema_only);

        } else {
            // handel dirNames within files
            if(path.dirname(filePath)){
                console.log(' found dir name in : '+path.dirname(filePath))
               await this.loadDirectory(filePath)
            }else{
            throw new Error('file should be json and absolute'+ filePath)
            }
        }
    }

    async loadDirectory(_directory:string) {
        const result = [];
        //  const _directory = directoryPath ? directoryPath : path.join(__dirname, './schema/');

        for (const fileName of await fs.promises.readdir(_directory)) {
            let _file = path.join(_directory, fileName);
            result.push(await this.loadFile(_file));
        }
        console.log('total Db models : ' + result.length);
        return result;
    }

    async makeSchema(jschema:JsonSchema, schema_only = false) {
        // convert json type to mongoose schema type
        Object.entries(jschema.schema).forEach((item) => {
            this.recursiveSearch(item);
        })
        if (schema_only) {
            return jschema;
        }
        // finally return new jsonModel
        return await JsonModel.createInstance(jschema);
    }
    typeMappings = {
        "String": String,
        "string": String,
        "Number": Number,
        "number": Number,
        "Boolean": Boolean,
        "boolean": Boolean,
        "_id": mongoose.Schema.Types.ObjectId,
        "id": mongoose.Schema.Types.ObjectId,
        "ObjectId": mongoose.Schema.Types.ObjectId,
        "objectId": mongoose.Schema.Types.ObjectId,
        "Date": Date.now().toString(),
        "date": Date.now().toString(),
    }
    // search item in object and map to mongoose schema
    recursiveSearch(item:any) {
        // types mapping

        for (let [itemKey, itemValue] of Object.entries(item)) {
            if (typeof itemValue === "object") {
                this.recursiveSearch(itemValue)
            } else {
                for (const [mapKey, mapValue] of Object.entries(this.typeMappings)) {
                    if (itemValue === mapKey) {
                        item[itemKey] = mapValue;
                    }
                }
            }

        }
    }

}


