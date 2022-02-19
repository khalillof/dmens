"use strict";
const path = require('path');
const fs = require('fs');
const { SchemaTypes} = require('mongoose');
const { JsonModel } = require('./json.model');

class JsonLoad {

    constructor(directoryPath, filePath, callback) {
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
    static async createInstance(directoryPath, filePath) {
        return await Promise.resolve(new JsonLoad(directoryPath, filePath));
    }
    async loadCustomFile(filePath, callback) {
        let sschema = await this.loadFile(filePath, true);

        if (typeof callback === 'function') {
            return await JsonModel.createInstance(sschema, callback)
        }
        return await JsonModel.createInstance(sschema);
    }
    async loadFile(filePath, schema_only = false) {
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

    async loadDirectory(_directory) {
        const result = [];
        //  const _directory = directoryPath ? directoryPath : path.join(__dirname, './schema/');

        for (const fileName of await fs.promises.readdir(_directory)) {
            let _file = path.join(_directory, fileName);
            result.push(await this.loadFile(_file));
        }
        console.log('total Db models : ' + result.length);
        return result;
    }

    async makeSchema(jschema, schema_only = false) {
        // convert json type to mongoose schema type
        Object.entries(jschema.schema).forEach((item) => {
            this.deepSearch(item);
        });

        // finally return new jsonModel
        return schema_only ? jschema : await JsonModel.createInstance(jschema);
    }

    typeMappings = {
        "String": String,
        "string": String,
        "Number": Number,
        "number": Number,
        "Boolean": Boolean,
        "boolean": Boolean,
        "_id": SchemaTypes.ObjectId,
        "id": SchemaTypes.ObjectId,
        "ObjectId": SchemaTypes.ObjectId,
        "objectid": SchemaTypes.ObjectId,
        "Date": SchemaTypes.Date,
        "date": SchemaTypes.Date,
        "Binary": SchemaTypes.Buffer,
        "binary": SchemaTypes.Buffer,
        "documentArray": SchemaTypes.DocumentArray,
        "documentarray": SchemaTypes.DocumentArray,
        "subDocument": SchemaTypes.Subdocument,
        "subdocument": SchemaTypes.Subdocument,
        "mixed": SchemaTypes.Mixed,
        "Mixed": SchemaTypes.Mixed,
        "decimal": SchemaTypes.Decimal128,
        "Decimal": SchemaTypes.Decimal128,
        "array": SchemaTypes.Array,
        "Array": SchemaTypes.Array,
        "ofString": [String],
        "ofstring": [String],
        "ofNumber": [Number],
        "ofnumber": [Number],
        "ofDates": [Date],
        "ofdates": [Date],
        "ofBuffer": [Buffer],
        "ofbuffer": [Buffer],
        "ofBoolean": [Boolean],
        "ofboolean": [Boolean],
        "ofMixed": [SchemaTypes.Mixed],
        "ofmixed": [SchemaTypes.Mixed],
        "ofObjectId": [SchemaTypes.ObjectId],
        "ofobjectId": [SchemaTypes.ObjectId],
        "ofArrays": [SchemaTypes.Array],
        "ofarrays": [SchemaTypes.Array],
        "ofArrayOfNumbers": [[Number]],
        "ofarrayofNumbers": [[Number]],
        "map": Map,
        "Map": Map,
        "mapOfString": { type: Map, of: String },
        "mapofstring": { type: Map, of: String }
    }

    validateSchema(json_schema) {
        // _schema.eachPath((_path, _type)=>{ if(_schema.path(mapKey) instanceof mongoose.SchemaType)}) 
        for (let [itemKey, itemValue] of Object.entries(json_schema.schema))
            if (!itemKey instanceof mongoose.SchemaType) {
                this.deepSearch({ itemKey: itemValue })
                if (!itemKey instanceof mongoose.SchemaType)
                    throw new Error('unvalid schema type :' + itemKey)
            }
    }
    // search item in object and map to mongoose schema
    deepSearch(item) {
        // types mapping
        for (let [itemKey, itemValue] of Object.entries(item)) {
            if (typeof itemValue === "object") {
                this.deepSearch(itemValue)
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
exports.JsonLoad = JsonLoad;

