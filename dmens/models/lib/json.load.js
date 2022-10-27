"use strict";
import path from 'path';
import fs from 'fs';
import { config } from '../../common/index.js';
import { JsonModel } from './json.model.js';
import mongoose from 'mongoose';
export const typeMappings = {
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
};
export class JsonLoad {
    static isJsonFile(file) {
        return path.extname(file) === '.json';
    }
    static async makeModel(jsonSchema) {
        let validSchema = await JsonLoad.makeSchema(jsonSchema);
        let model = await JsonModel.createInstance(validSchema);
        return Promise.resolve(model);
    }
    static async makeModelFromJsonData(jsonData) {
        if (typeof jsonData === 'string')
            jsonData = JSON.parse(jsonData);
        return await JsonLoad.makeModel(jsonData);
    }
    static async makeModelFromJsonFile(filePath, callback) {
        if (path.isAbsolute(filePath) && JsonLoad.isJsonFile(filePath)) {
            let data = fs.readFileSync(filePath, 'utf8');
            let jsobj = JSON.parse(data);
            return await JsonLoad.makeModel(jsobj), callback;
        }
        else {
            // handel dirNames within files
            if (path.dirname(filePath)) {
                console.log(' found dir name in : ' + path.dirname(filePath));
                await JsonLoad.loadDirectory(filePath);
            }
            else {
                throw new Error('file should be json and absolute' + filePath);
            }
        }
        throw new Error('file should be json and absolute' + filePath);
    }
    // if no directory provided will use default directory
    static async loadDirectory(directory = config.schemaDir()) {
        if (path.dirname(directory)) {
            return await Promise.all(fs.readdirSync(directory).map(async (fileName) => {
                let _file = path.join(directory, fileName);
                if (JsonLoad.isJsonFile(_file)) {
                    return await JsonLoad.makeModelFromJsonFile(_file);
                }
                return;
            }));
        }
        else {
            throw new Error('directory Not Found : ' + directory);
        }
    }
    static async makeSchema(jschema) {
        for (let item of Object.entries(jschema.schema))
            await JsonLoad.deepSearch(item);
        return jschema;
    }
    // search item in object and map to mongoose schema
    static isValidType(value) {
        return 'number, string, boolean'.indexOf(typeof value) !== -1;
    }
    // search item in object and map to mongoose schema
    static async deepSearch(item) {
        // loop over the item
        for (let [itemIndex, itemValue] of Object.entries(item)) {
            // check if item is object then call deepSearch agin recursively
            if (typeof itemValue === "object") {
                await JsonLoad.deepSearch(itemValue);
            }
            else {
                // loop over typeMappings to map user schema string type to mongoose typings
                for (const [mapKey, mapValue] of Object.entries(typeMappings)) {
                    if (itemValue === mapKey) {
                        item[itemIndex] = mapValue;
                    }
                    else {
                        // check for the item didn't match our typemappings is valid type or raise error
                        if (!JsonLoad.isValidType(itemValue))
                            throw new Error('unvalid schema type value for the key:' + item[itemIndex] + ' :' + itemValue);
                    }
                }
            }
        }
    }
}
