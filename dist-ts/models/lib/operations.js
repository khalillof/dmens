"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operations = void 0;
const tslib_1 = require("tslib");
const model_db_js_1 = require("./model.db.js");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const index_js_1 = require("../../common/index.js");
const index_js_2 = require("../../services/index.js");
const index_js_3 = require("../../routes/index.js");
const configration_js_1 = require("./configration.js");
const index_js_4 = require("../../controllers/index.js");
//=============================================
class Operations {
    static async create_default_models_routes() {
        // create configration Template model
        await Operations.createModelInstance(configration_js_1.configTemplateProps);
        // create configration Routes with configController
        await (0, index_js_3.ConfigRoutes)();
        // create account roles
        await Operations.createModelConfigRoute(configration_js_1.roleConfigSchema);
        // create account model config and routes
        await Operations.createModelWithConfig(configration_js_1.accConfgSchema);
        await (0, index_js_3.AccountRoutes)();
        // load models routes from default directory
        await Operations.createModelsRoutesFromDirectory();
        // create models routes from default db
        await Operations.createModelsRoutesFromDb();
    }
    // ============ DbModel
    static async createModelInstance(_config) {
        let _model = new model_db_js_1.ModelDb(_config);
        return Promise.resolve(_model);
    }
    static async createModelWithConfig(_config) {
        let _model = await Operations.createModelInstance(_config);
        await _model.createConfig();
        return _model;
    }
    // ===================== Routes
    static async createRouteInstance(controller, callback) {
        return Promise.resolve(new index_js_3.DefaultRoutesConfig(controller, callback));
    }
    static async createModelConfigRoute(_config, controller, routeCallback) {
        let _model = await Operations.createModelWithConfig(_config);
        return await Operations.createRouteInstance(controller ?? new index_js_4.DefaultController(_model.name), routeCallback);
    }
    // create model route from config 
    static async createModelsRoutesFromDb() {
        let allDbConfigs = await index_js_2.Store.db.get('config').model.find();
        allDbConfigs = allDbConfigs.filter((p) => !index_js_2.Store.db.exist(p.name));
        if (allDbConfigs.length)
            for await (let config of allDbConfigs) {
                await Operations.createModelInstance(config);
                await Operations.createRouteInstance(new index_js_4.DefaultController(config.name));
            }
        ;
    }
    // create or override model config route
    static async overrideModelConfigRoute(_config) {
        let dbName = _config.name;
        if (!dbName || !index_js_2.Store.db.exist(dbName)) {
            index_js_1.envs.throwErr(' db model name not found');
        }
        // delete model if exists
        index_js_2.Store.db.delete(dbName);
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
        if (path_1.default.isAbsolute(filePath) && Operations.isJsonFile(filePath)) {
            let data = fs_1.default.readFileSync(filePath, 'utf8');
            let jsobj = JSON.parse(data);
            return await Operations.createModelConfigRoute(jsobj);
        }
        else {
            // handel dirNames within files
            if (path_1.default.dirname(filePath)) {
                console.log(' found dir name in : ' + path_1.default.dirname(filePath));
                await Operations.createModelsRoutesFromDirectory(filePath);
            }
            else {
                throw new Error('file should be json and absolute' + filePath);
            }
        }
        throw new Error('file should be json and absolute' + filePath);
    }
    // if no directory provided will use default directory
    static async createModelsRoutesFromDirectory(directory = index_js_1.envs.schemaDir()) {
        if (fs_1.default.existsSync(directory)) {
            return await Promise.all(fs_1.default.readdirSync(directory).map(async (fileName) => {
                let _file = path_1.default.join(directory, fileName);
                if (Operations.isJsonFile(_file)) {
                    return await Operations.createModelFromJsonFile(_file);
                }
                return;
            }));
        }
        else {
            //throw new Error('directory Not Found : ' + directory);
            index_js_1.envs.logLine(`(( createModelsRoutesFromDirectory )) => Directory not found : ${directory}`);
            return null;
        }
    }
    // helpers :.............................................
    static isJsonFile(file) {
        return path_1.default.extname(file) === '.json';
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
                for (const [mapKey, mapValue] of Object.entries(configration_js_1.typeMappings)) {
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
exports.Operations = Operations;
