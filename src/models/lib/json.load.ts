"use strict";
import path from 'path';
import fs from 'fs';

import { dbStore, config } from '../../common/index.js';
import { JsonSchema } from '../../interfaces/index.js';
import { JsonModel } from './json.model.js';
import mongoose from 'mongoose';


export class JsonLoad {

    static async loadCustomFile(filePath: string, callback?: any) {
        let sschema = await JsonLoad.loadFile(filePath);
        return await JsonModel.createInstance(sschema, callback);
    }

    static validate(jsonSchema: JsonSchema) {
        if (!jsonSchema.name)
            throw new Error(' schema validation faild ! property name is required')
        if (dbStore[jsonSchema.name.toLowerCase()])
            throw new Error(`schema validation faild ! name property : ${jsonSchema.name} already on db : `)
    }

    static isJsonFile(file: string) {
        return path.extname(file) === '.json';
    }
    static async loadFromData(jsonData: any) {

        if (typeof jsonData === 'string')
            jsonData = JSON.parse(jsonData);

        let validSchema = await JsonLoad.makeSchema(jsonData);
        return await JsonLoad.makeModel(validSchema);
    }
    // will return valid schema or throw error
    static async loadFile(filePath: string) {
        if (path.isAbsolute(filePath) && JsonLoad.isJsonFile(filePath)) {

            let data = await fs.promises.readFile(filePath, 'utf8');
            let jsobj = JSON.parse(data);

            return await JsonLoad.makeSchema(jsobj);

        } else {
            // handel dirNames within files
            if (path.dirname(filePath)) {
                console.log(' found dir name in : ' + path.dirname(filePath))
                await JsonLoad.loadDirectory(filePath)
            } else {
                throw new Error('file should be json and absolute' + filePath)
            }
        }
        throw new Error('file should be json and absolute' + filePath)
    }

    static async loadDefaultDirectory() {
        return await JsonLoad.loadDirectory(config.schemaDir());
    }

    static async loadDirectory(directory: string) {
        let result = [];

        if (path.dirname(directory)) {
            //=======================
            result = await Promise.all(fs.readdirSync(directory).map(async (fileName: string) => {
                let _file = path.join(directory, fileName);
                if (JsonLoad.isJsonFile(_file)) {
                    let validschema = await JsonLoad.loadFile(_file);
                    let mdl = await JsonLoad.makeModel(validschema!);
                    return mdl;
                }
                return;
            }))
        } else {
            throw new Error('directory Not Found : ' + directory)
        }
        //====================
        /*
        for (const fileName of fs.readdirSync(directory)) {
            let _file = path.join(directory, fileName);
            if(JsonLoad.isJsonFile(_file)){
                let validschema = await JsonLoad.loadFile(_file); 
                result.push(await JsonLoad.makeModel(validschema!)); 
            }
        }
    }else{

    throw new Error('directory Not Found : '+ directory)
    }
 */
        return result;

    }

    static async makeSchema(jschema: JsonSchema) {
        JsonLoad.validate(jschema)

        for (let item of Object.entries(jschema.schema))
            await JsonLoad.deepSearch(item)
        return jschema;
    }
    static async makeModel(jschema: JsonSchema) {
        return await JsonModel.createInstance(jschema);
    }
    static typeMappings = {
        "String": mongoose.SchemaTypes.String,
        "string": mongoose.SchemaTypes.String,
        "Number": mongoose.SchemaTypes.Number,
        "number": mongoose.SchemaTypes.Number,
        "Date": mongoose.SchemaTypes.Date,
        "date": mongoose.SchemaTypes.Date,
        "Binary": mongoose.SchemaTypes.Buffer,
        "binary": mongoose.SchemaTypes.Buffer,
        "Boolean": mongoose.SchemaTypes.Boolean,
        "boolean": mongoose.SchemaTypes.Boolean,
        "mixed": mongoose.SchemaTypes.Mixed,
        "Mixed": mongoose.SchemaTypes.Mixed,
        "_id": mongoose.SchemaTypes.ObjectId,
        "id": mongoose.SchemaTypes.ObjectId,
        "ObjectId": mongoose.SchemaTypes.ObjectId,
        "objectid": mongoose.SchemaTypes.ObjectId,
        "array": mongoose.SchemaTypes.Array,
        "Array": mongoose.SchemaTypes.Array,
        "decimal": mongoose.SchemaTypes.Decimal128,
        "Decimal": mongoose.SchemaTypes.Decimal128,
        "map": mongoose.SchemaTypes.Map,
        "Map": mongoose.SchemaTypes.Map,
    }
    // search item in object and map to mongoose schema
    static isValidType(value: any) {
        return 'number,string,boolean'.indexOf(typeof value) !== -1
    }
    // search item in object and map to mongoose schema
    static async deepSearch(item: any) {

        // loop over the item
        for (let [itemIndex, itemValue] of Object.entries(item)) {

            // check if item is object then call deepSearch agin recursively
            if (typeof itemValue === "object") {
                await JsonLoad.deepSearch(itemValue)
            } else {

                // loop over typeMappings to map user schema string type to mongoose typings
                for (const [mapKey, mapValue] of Object.entries(JsonLoad.typeMappings)) {
                    if (itemValue === mapKey) {
                        item[itemIndex] = mapValue;
                    }
                    else {
                        // check for the item didn't match our typemappings is valid type or raise error
                        if (!JsonLoad.isValidType(itemValue))
                            throw new Error('unvalid schema type value for the key:' + item[itemIndex] + ' :' + itemValue)
                    }
                }
            }

        }
    }

}


