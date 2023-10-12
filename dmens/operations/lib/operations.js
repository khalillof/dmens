"use strict";
import { DbModel } from '../../models/lib/db.model.js';
import path from 'path';
import fs from 'fs';
import { Svc, envs } from '../../common/index.js';
import { DefaultRoutesConfig, ConfigRoutes, AccountRoutes } from '../../routes/index.js';
import { accConfgSchema, typeMappings, configConfigProp } from './help.js';
import { DefaultController } from '../../controllers/index.js';
//=============================================
export class Operations {
    static async create_default_models_routes() {
        // create config model and routes
        await Operations.createModelWithConfig(configConfigProp);
        await ConfigRoutes();
        // create account model config and routes
        await Operations.createModelWithConfig(accConfgSchema);
        await AccountRoutes();
        // load models routes from default directory
        return await Operations.createModelsRoutesFromDirectory();
    }
    // ============ DbModel
    static async createModelWithConfig(_config) {
        let _model = new DbModel(_config);
        await _model.createConfig();
        return Promise.resolve(_model);
    }
    // ===================== Routes
    static async createRouteInstance(controller, callback) {
        return Promise.resolve(new DefaultRoutesConfig(controller, callback));
    }
    static async createModelConfigRoute(_config, controller, routeCallback) {
        let _model = await Operations.createModelWithConfig(_config);
        // await _model.createConfig();
        return await Operations.createRouteInstance(controller ?? new DefaultController(_model.name), routeCallback);
    }
    // create or override model config route
    static async overrideModelConfigRoute(_config) {
        let dbName = _config.name;
        if (!dbName || !Svc.db.exist(dbName)) {
            envs.throwErr(' db model name not found');
        }
        // delete model if exists
        Svc.db.delete(dbName);
        return await Operations.createModelConfigRoute(_config);
    }
    static async createModelFromJsonString(jsonString) {
        if (typeof jsonString === 'string') {
            let _conf = JSON.parse(jsonString);
            return await Operations.createModelConfigRoute(_conf);
        }
        else {
            throw new Error('this method makeModelFromJsonString require json data as string');
        }
    }
    static async createModelFromJsonFile(filePath) {
        if (path.isAbsolute(filePath) && Operations.isJsonFile(filePath)) {
            let data = fs.readFileSync(filePath, 'utf8');
            let jsobj = JSON.parse(data);
            return await Operations.createModelConfigRoute(jsobj);
        }
        else {
            // handel dirNames within files
            if (path.dirname(filePath)) {
                console.log(' found dir name in : ' + path.dirname(filePath));
                await Operations.createModelsRoutesFromDirectory(filePath);
            }
            else {
                throw new Error('file should be json and absolute' + filePath);
            }
        }
        throw new Error('file should be json and absolute' + filePath);
    }
    // if no directory provided will use default directory
    static async createModelsRoutesFromDirectory(directory = envs.schemaDir()) {
        if (path.dirname(directory)) {
            return await Promise.all(fs.readdirSync(directory).map(async (fileName) => {
                let _file = path.join(directory, fileName);
                if (Operations.isJsonFile(_file)) {
                    return await Operations.createModelFromJsonFile(_file);
                }
                return;
            }));
        }
        else {
            throw new Error('directory Not Found : ' + directory);
        }
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
