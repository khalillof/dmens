"use strict";
const path = require('path');
const fs = require('fs');
const { SchemaTypes} = require('mongoose');
const { JsonModel } = require('./json.model');
const { dbStore} = require('../common/customTypes/types.config');

class JsonLoad {


    static async isValidName(name){
        if (!name) 
         throw new Error(' schema name is required property')
    
      if (dbStore[name.toLowerCase()]) 
       throw new Error('schema name already on db : '+name)
     }

     static async loadFromData(jsonData){
    
            if (typeof jsonData === 'string')
               jsonData = JSON.parse(jsonData);
           
            JsonLoad.isValidName(jsonData.name)
    
            return await JsonLoad.makeSchema(jsonData); 
     }

   static async loadCustomFile(filePath, callback) {
        let sschema = await JsonLoad.loadFile(filePath, true);
    return  await JsonModel.createInstance(sschema, callback);
    }

   static async loadFile(filePath, schema_only = false) {
        if (path.isAbsolute(filePath) && path.extname(filePath) === '.json') {

            let data = await fs.promises.readFile(filePath, 'utf8');
            let jsobj = JSON.parse(data);
            JsonLoad.isValidName(jsobj.name)

            return await JsonLoad.makeSchema(jsobj, schema_only);

        } else {
            // handel dirNames within files
            if(path.dirname(filePath)){
                console.log(' found dir name in : '+path.dirname(filePath))
               await JsonLoad.loadDirectory(filePath)
            }else{
            throw new Error('file should be json and absolute'+ filePath)
            }
        }
    }
   static async loadDefaultDirectory() {
        return await JsonLoad.loadDirectory(path.join(__dirname, './schema/'));
    }

   static async loadDirectory(directory) {
        const result = [];

        if(path.dirname(directory)){
            for (const fileName of await fs.promises.readdir(directory)) {
                let _file = path.join(directory, fileName);
                if(path.extname(_file) ==='.json'){
                    result.push(await JsonLoad.loadFile(_file)); 
                }
               
            }

        }else{

        throw new Error('directory Not Found : '+ directory)
        }

        return result;
    }

   static async makeSchema(jschema, schema_only = false) {
        // convert json type to mongoose schema type
        Object.entries(jschema.schema).forEach((item) => JsonLoad.deepSearch(item));

        // finally return new jsonModel
        return schema_only ? jschema : await JsonModel.createInstance(jschema);
    }

   static typeMappings = {
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

   static validateSchema(json_schema) {
        // _schema.eachPath((_path, _type)=>{ if(_schema.path(mapKey) instanceof mongoose.SchemaType)}) 
        for (let [itemKey, itemValue] of Object.entries(json_schema.schema))
            if (!itemKey instanceof mongoose.SchemaType) {
                this.deepSearch({ itemKey: itemValue })
                if (!itemKey instanceof mongoose.SchemaType)
                    throw new Error('unvalid schema type :' + itemKey)
            }
    }
    // search item in object and map to mongoose schema
  static  deepSearch(item) {
        // types mapping
        for (let [itemKey, itemValue] of Object.entries(item)) {
            if (typeof itemValue === "object") {
                JsonLoad.deepSearch(itemValue)
            } else {
                for (const [mapKey, mapValue] of Object.entries(JsonLoad.typeMappings)) {
                    if (itemValue === mapKey) {
                        item[itemKey] = mapValue;
                    }
                }
            }

        }
    }

}
exports.JsonLoad = JsonLoad;

