import path from 'path';
//import fs from 'fs';
import { readdir, readFile } from 'fs/promises';
import mongoose, { Schema, Model, Types } from 'mongoose';
import passport from 'passport';
var passportLocalMongoose = require('passport-local-mongoose');
import { Strategy as LocalStrategy } from 'passport-local';
import { dbStore, SvcStore, createInstance, modelStore, IJsonModel } from '../common/customTypes/types.config';
import { Svc } from '../services/Svc.services';
//import { JsonModel } from './json.model';

export async function loadJsons(directoryPath?: string): Promise<Array<IJsonModel>> {
    const result: Array<IJsonModel> | any = [];
    const _directory = directoryPath ? directoryPath: path.join(__dirname, './schema/' );

    try {
        const fileNames = await readdir(_directory);
        for await (const fileName of fileNames){
            if (path.extname(fileName) === '.json') {

                let _file = path.join(_directory, fileName);
                let data = await readFile(_file, 'utf8');
                let jsonobj = JSON.parse(data);
                result.push(makeSchema(jsonobj));
            }
        }        
      } catch (err) {
        console.error(err);
      }

    return result;
};


function makeSchema(jIJsonModel: IJsonModel): IJsonModel {
    Object.entries(jIJsonModel.schema).forEach((item) => {
        recursiveSearch(item);
    })

    return makeModel(jIJsonModel);
    //return jIJsonModel;
}
// search item in object
function recursiveSearch(item: any) {
    // types mapping
    const typeMappings = {
        "String": String,
        "string": String,
        "Number": Number,
        "Boolean": Boolean,
        "_id": mongoose.Schema.Types.ObjectId,
        "mongoose.Schema.Types.ObjectId": mongoose.Schema.Types.ObjectId,
        "Date.now().toString()": Date.now().toString()
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

function makeModel(jsonModel: IJsonModel): IJsonModel {
    jsonModel.schema = new Schema(jsonModel.schema, { timestamps: true });
    if (jsonModel.name === 'User') {
        
        jsonModel.schema.plugin(passportLocalMongoose);
        jsonModel.model = mongoose.model(jsonModel.name, jsonModel.schema);
        passport.use(new LocalStrategy(jsonModel.model.authenticate()));
        passport.serializeUser(jsonModel.model.serializeUser());
        passport.deserializeUser(jsonModel.model.deserializeUser());

    } else {
        jsonModel.model = mongoose.model(jsonModel.name, jsonModel.schema);
    }
     dbStore[jsonModel.name] = jsonModel.model;
     SvcStore[jsonModel.name] = createInstance(Svc, jsonModel.model)
    console.log("added Db & Svc to local stores :" + jsonModel.name)
    return  jsonModel;
    //return createInstance(JsonModel,jsonModel)
}


