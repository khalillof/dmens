"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const path = require('path');
//import fs from 'fs';
const fs = require('fs');
const mongoose = require( 'mongoose');

const { dbStore, SvcStore} = require('../common/customTypes/types.config');

const { JsonModel } = require('./Json.model');
const { Svc } = require('../services/Svc.services');

async function loadJsons(directoryPath) {
    const result = [];
    const _directory = directoryPath ? directoryPath : path.join(__dirname, './schema/');

    try {
        const fileNames = await fs.promises.readdir(_directory);
        for await (const fileName of fileNames) {
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

exports.loadJsons = loadJsons;

async function makeSchema(jschema){

    Object.entries(jschema.schema).forEach((item) => {
        recursiveSearch(item);
    })
    
    return await makeModel(jschema);
}
// search item in object
function recursiveSearch(item) {
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

async function makeModel(jsonSchema){
    let jmodel= await JsonModel.createInstance(jsonSchema)
    dbStore[jsonSchema.name] = jmodel;
    SvcStore[jmodel.name] = await Svc.createInstance(jmodel.model);

    return  await Promise.resolve(jmodel);
    //return createInstance(JsonModel,jsonModel)
}


