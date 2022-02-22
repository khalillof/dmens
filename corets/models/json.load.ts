"use strict";
import path from 'path';
//import fs from 'fs';
import fs from 'fs';
import{SchemaTypes} from 'mongoose';
import { JsonSchema , dbStore} from '../common/customTypes/types.config';
import { JsonModel} from './json.model';

export class JsonLoad {


  static async loadCustomFile(filePath:string, callback?:any) {
        let sschema = await JsonLoad.loadFile(filePath, true);
        return await JsonModel.createInstance(sschema, callback);
    }

 static async isValidName(name:string){
    if (!name) 
     throw new Error(' schema name is required property')

  if (dbStore[name.toLowerCase()]) 
   throw new Error('schema name already on db : '+name)
 }

 static async loadFromData(jsonData:any){

        if (typeof jsonData === 'string')
           jsonData = JSON.parse(jsonData);
       
        JsonLoad.isValidName(jsonData.name)

        return await JsonLoad.makeSchema(jsonData); 
 }
   static async loadFile(filePath:string, schema_only = false) {
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

  static  async loadDirectory(directory:string) {
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
    
   static async makeSchema(jschema:JsonSchema, schema_only = false) {
        let name = jschema.name.toLowerCase();
        if(dbStore[name]){
            throw new Error('there is already model in this name : '+name)
          }
        // convert json type to mongoose schema type
        Object.entries(jschema.schema).forEach((item) => JsonLoad.recursiveSearch(item))

        // finally return new jsonModel
        return  schema_only ? jschema : await JsonModel.createInstance(jschema);
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
        //"subDocument": SchemaTypes.Subdocument,
        //"subdocument": SchemaTypes.Subdocument,
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
    // search item in object and map to mongoose schema
  static  recursiveSearch(item:any) {
        // types mapping

        for (let [itemKey, itemValue] of Object.entries(item)) {
            if (typeof itemValue === "object") {
                this.recursiveSearch(itemValue)
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


