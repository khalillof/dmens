import path from 'path';
//import fs from 'fs';
import fs from 'fs';
import mongoose from 'mongoose';
import { JsonSchema } from '../common/customTypes/types.config';
import { JsonModel } from './Json.model';


export async function loadJsons(directoryPath?: string): Promise<Array<JsonSchema>> {
    const result: Array<JsonSchema> | any = [];
    const _directory = directoryPath ? directoryPath : path.join(__dirname, './schema/');

    try {
        for await (const fileName of await fs.promises.readdir(_directory)) {
            if (path.extname(fileName) === '.json') {

                let _file = path.join(_directory, fileName);
                let data = await fs.promises.readFile(_file, 'utf8');
                let jsonobj = JSON.parse(data);
                if(! jsonobj.name){
                    throw new Error(' jschema name is required property')
                }
                result.push(await makeSchema(jsonobj));
            }
        }
    } catch (err) {
        console.error(err);
    }

    return result;
};


async function makeSchema(jschema: JsonSchema):Promise< JsonSchema> {

    // map json schema to mongoose schema types
    Object.entries(jschema.schema).forEach((item) => {
        recursiveSearch(item);
    })
    
    // retun full modeldb
    return await JsonModel.createInstance(jschema);
}
// search item in object
function recursiveSearch(item: any) {
    // types mapping
    const typeMappings = {
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
    for (let [itemKey, itemValue] of Object.entries(item)) {
        if (typeof itemValue === "object") {
            recursiveSearch(itemValue)
        } else {
            for (const [mapKey, mapValue] of Object.entries(typeMappings)) {
                if (itemValue === mapKey) {
                    item[itemKey] = mapValue;
                }
            }
        }

    }
}




