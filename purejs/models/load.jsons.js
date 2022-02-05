"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const path = require('path');
//import fs from 'fs';
const fs = require('fs');
const mongoose = require( 'mongoose');
const { JsonModel } = require('./Json.model');

async function loadJsons(directoryPath) {
    const result = [];
    const _directory = directoryPath ? directoryPath : path.join(__dirname, './schema/');

    try {
        const fileNames = await fs.promises.readdir(_directory);
        for await (const fileName of fileNames) {
            if (path.extname(fileName) === '.json') {

                let _file = path.join(_directory, fileName);
                let data = await fs.promises.readFile(_file, 'utf8');
                let jsobj = JSON.parse(data);
                if(! jsobj.name){
                    throw new Error(' jschema name is required property')
                }
                result.push(await makeSchema(jsobj));
            }
        }
    } catch (err) {
        console.error(err);
    }

    return result;
};

exports.loadJsons = loadJsons;

async function makeSchema(jschema){
    // convert json type to mongoose schema type
    Object.entries(jschema.schema).forEach((item) => {
        recursiveSearch(item);
    })
    // finally return new jsonModel
    return await JsonModel.createInstance(jschema);
}
// search item in object and map to mongoose schema
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



