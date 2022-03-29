"use strict";
import path from 'path';
import fs from 'fs';
import{SchemaTypes, SchemaType} from 'mongoose';
import { dbStore, config} from '../../common';
import { JsonSchema} from '../../interfaces';
import { JsonModel} from './json.model';

export class JsonLoad {

  static async loadCustomFile(filePath:string, callback?:any) {
        let sschema = await JsonLoad.loadFile(filePath);
        return await JsonModel.createInstance(sschema, callback);
    }

    static validate(jsonSchema:JsonSchema){
        if (!jsonSchema.name)
           throw new Error(' schema validation faild ! property name is required')
        if (typeof jsonSchema.loadref !== 'boolean')
           throw new Error(' schema validation faild ! property loadref is required')
        if (dbStore[jsonSchema.name.toLowerCase()]) 
          throw new Error(`schema validation faild ! name property : ${jsonSchema.name} already on db : `)
     }

 static isJsonFile(file:string){
    return path.extname(file) ==='.json';
 }
 static async loadFromData(jsonData:any){

        if (typeof jsonData === 'string')
           jsonData = JSON.parse(jsonData);

        let validSchema = await JsonLoad.makeSchema(jsonData); 
        return await JsonLoad.makeModel(validSchema);
 }
 // will return valid schema or throw error
   static async loadFile(filePath:string) {
        if (path.isAbsolute(filePath) && JsonLoad.isJsonFile(filePath)) {

            let data = await fs.promises.readFile(filePath, 'utf8');
            let jsobj = JSON.parse(data);

            return await JsonLoad.makeSchema(jsobj);

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
        return await JsonLoad.loadDirectory(config.schemaDir());
    }

  static  async loadDirectory(directory:string) {
    const result = [];

    if(path.dirname(directory)){
        for (const fileName of await fs.promises.readdir(directory)) {
            let _file = path.join(directory, fileName);
            if(JsonLoad.isJsonFile(_file)){
                let validschema = await JsonLoad.loadFile(_file); 
                result.push(await JsonLoad.makeModel(validschema!)); 
            }
        }
    }else{

    throw new Error('directory Not Found : '+ directory)
    }

    return result;
}

   static async makeSchema(jschema:JsonSchema) {
        JsonLoad.validate(jschema)
        // convert json type to mongoose schema type
        Object.entries(jschema.schema).forEach((item) => JsonLoad.deepSearch(item));

        return  jschema ;
    }
    static async makeModel(jschema:JsonSchema) {
        return  await JsonModel.createInstance(jschema);
    }
    static typeMappings = {
        "String": SchemaTypes.String,
        "string": SchemaTypes.String,
        "Number": SchemaTypes.Number,
        "number": SchemaTypes.Number,
        "Date": SchemaTypes.Date,
        "date": SchemaTypes.Date,
        "Binary": SchemaTypes.Buffer,
        "binary": SchemaTypes.Buffer,
        "Boolean": SchemaTypes.Boolean,
        "boolean": SchemaTypes.Boolean,
        "mixed": SchemaTypes.Mixed,
        "Mixed": SchemaTypes.Mixed,
        "_id": SchemaTypes.ObjectId,
        "id": SchemaTypes.ObjectId,
        "ObjectId": SchemaTypes.ObjectId,
        "objectid": SchemaTypes.ObjectId,
        "array": SchemaTypes.Array,
        "Array": SchemaTypes.Array,
        "decimal": SchemaTypes.Decimal128,
        "Decimal": SchemaTypes.Decimal128,
        "map": Map,
        "Map": Map,
    }
    // search item in object and map to mongoose schema
    static isValidType (value:any) { 
        return 'number,string,boolean'.indexOf(typeof value) !== -1 
      }
    // search item in object and map to mongoose schema
  static  deepSearch(item:any) {
     
        // loop over the item
        for (let [itemIndex, itemValue] of Object.entries(item))  {           
        
        // check if item is object then call deepSearch agin recursively
            if (typeof itemValue === "object") {
                JsonLoad.deepSearch(itemValue)           
            } else {
    
                // loop over typeMappings to map user schema string type to mongoose typings
                for (const [mapKey, mapValue] of Object.entries(JsonLoad.typeMappings)) {
                    if (itemValue === mapKey) {
                        item[itemIndex] = mapValue;
                    }
                    else{
                        // check for the item didn't match our typemappings is valid type or raise error
                        if (!JsonLoad.isValidType(itemValue))
                            throw new Error('unvalid schema type value for the key:' + item[itemIndex] +' :'+itemValue)
                    }
                }
            }

        }
    }

}


