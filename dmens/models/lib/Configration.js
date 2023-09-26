"use strict";
import mongoose from 'mongoose';
import { DbModel } from './json.model.js';
import path from 'path';
import fs from 'fs';
import { config } from '../../common/index.js';
import { DefaultRoutesConfig, ConfigRoutes, AuthRoutes } from '../../routes/index.js';
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
export const confSchema = {
    name: {
        "type": String,
        "unique": true,
        "lowercase": true,
        "required": true,
        "minLength": 3,
        "maxLength": 30
    },
    active: {
        "type": Boolean,
        "default": false
    },
    useAuth: {
        "type": [String],
        "default": []
    },
    useAdmin: {
        "type": [String],
        "default": []
    },
    schemaOptions: {
        "type": Object,
    },
    schemaObj: {
        "type": Object,
        "required": true
    }
};
export const accConfgSchema = {
    name: "account",
    active: true,
    useAuth: ["list", "get", "post", "put", "delete"],
    useAdmin: ["list"],
    schemaOptions: { timestamps: true, strict: true },
    schemaObj: {
        username: {
            "type": String,
            "unique": true,
            "lowercase": true,
            "required": true,
            "minLength": 3,
            "maxLength": 30
        },
        active: {
            "type": Boolean,
            "default": false
        },
        email: {
            "type": String,
            "unique": true,
            "lowercase": true,
            "required": true,
            "minLength": 3,
            "maxLength": 30
        },
        refreshToken: {
            "type": String,
            "minLength": 10,
            "maxLength": 100
        },
        refreshTokenExpireAt: {
            "type": Date
        },
        email_verified: {
            "type": Boolean,
            "default": false
        },
        firstname: {
            "type": String,
            "minLength": 3,
            "maxLength": 50
        },
        lastname: {
            "type": String,
            "minLength": 3,
            "maxLength": 50
        },
        last_login: {
            "type": Date
        },
        facebookId: {
            "type": String,
            "default": ""
        },
        roles: [
            {
                "type": mongoose.Types.ObjectId,
                "ref": "role",
                "autopopulate": true
            }
        ]
    }
};
export class Configration {
    static async create_default_models_routes(app) {
        // create config model
        const _configProp = {
            name: "config",
            active: true,
            useAuth: ["list", "get", "post", "put", "delete"],
            useAdmin: ["list", "get", "post", "put", "delete"],
            schemaOptions: { timestamps: true, strict: true },
            schemaObj: confSchema
        };
        // create config model and routes
        await Configration.createModelInstance(_configProp);
        await Configration.createInstanceWithRouteConfigCallback(app, ConfigRoutes);
        // create account model config and routes
        await Configration.createModelWithConfigAndRoutes(app, accConfgSchema);
        // auth routes
        await Configration.createInstanceWithRouteConfigCallback(app, AuthRoutes);
        // load models routes from default directory
        return await Configration.createModelsRoutesFromDirectory(app);
    }
    static async createInstance(constructor, ...args) {
        return Promise.resolve(new constructor(...args));
    }
    // ============ DbModel
    static async createModelInstance(_config, callback) {
        return Promise.resolve(new DbModel(_config, callback));
    }
    static async createModelWithConfigAndRoutes(app, _config, controller, routeCallback) {
        let _model = await Configration.createModelInstance(_config);
        await _model.createConfig();
        return await Configration.createRouteInstance(app, _model.name, controller, routeCallback);
    }
    static async createModelFromJsonString(app, jsonString) {
        if (typeof jsonString === 'string') {
            let _conf = JSON.parse(jsonString);
            return await Configration.createModelWithConfigAndRoutes(app, _conf);
        }
        else {
            throw new Error('this method makeModelFromJsonString require json data as string');
        }
    }
    static async createModelFromJsonFile(app, filePath) {
        if (path.isAbsolute(filePath) && Configration.isJsonFile(filePath)) {
            let data = fs.readFileSync(filePath, 'utf8');
            let jsobj = JSON.parse(data);
            return await Configration.createModelWithConfigAndRoutes(app, jsobj);
        }
        else {
            // handel dirNames within files
            if (path.dirname(filePath)) {
                console.log(' found dir name in : ' + path.dirname(filePath));
                await Configration.createModelsRoutesFromDirectory(app, filePath);
            }
            else {
                throw new Error('file should be json and absolute' + filePath);
            }
        }
        throw new Error('file should be json and absolute' + filePath);
    }
    // if no directory provided will use default directory
    static async createModelsRoutesFromDirectory(app, directory = config.schemaDir()) {
        if (path.dirname(directory)) {
            return await Promise.all(fs.readdirSync(directory).map(async (fileName) => {
                let _file = path.join(directory, fileName);
                if (Configration.isJsonFile(_file)) {
                    return await Configration.createModelFromJsonFile(app, _file);
                }
                return;
            }));
        }
        else {
            throw new Error('directory Not Found : ' + directory);
        }
    }
    // ===================== Routes
    static async createRouteInstance(exp, rName, controller, callback) {
        return Promise.resolve(new DefaultRoutesConfig(exp, rName, controller, callback));
    }
    static async createInstanceRouteWithDefault(app, name) {
        return await Configration.createRouteInstance(app, name);
    }
    static async createInstanceWithRouteConfigCallback(app, routeCb) {
        return await Configration.createRouteInstance(app, routeCb.routeName, routeCb.controller, routeCb.routeCallback);
    }
    // helpers :.............................................
    static isJsonFile(file) {
        return path.extname(file) === '.json';
    }
    static async validateSchema(schemaObj) {
        for await (let item of Object.entries(schemaObj)) {
            await this.deepSearch(item);
        }
        //  return iconfig;
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
                await this.deepSearch(itemValue);
            }
            else {
                // loop over typeMappings to map user schema string type to mongoose typings
                for (const [mapKey, mapValue] of Object.entries(typeMappings)) {
                    if (itemValue === mapKey) {
                        item[itemIndex] = mapValue;
                    }
                    else {
                        // check for the item didn't match our typemappings is valid type or raise error
                        if (!this.isValidType(itemValue))
                            throw new Error('unvalid schema type value for the key:' + item[itemIndex] + ' :' + itemValue);
                    }
                }
            }
        }
    }
}
