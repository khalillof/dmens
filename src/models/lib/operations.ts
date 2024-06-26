"use strict";
import { IModelConfig, IModelConfigParameters, IController, IRouteCallback } from '../../interfaces/index.js';
import { ModelDb } from './model.db.js';
import path from 'path';
import fs from 'fs';
import {envs } from '../../common/index.js';
import { Store} from '../../services/index.js';
import { DefaultRoutesConfig, ConfigRoutes, AccountRoutes } from '../../routes/index.js';
import { accConfgSchema, typeMappings, configTemplateProps, roleConfigSchema} from './configration.js';
import { DefaultController } from '../../controllers/index.js';

//=============================================

export class Operations {

  static async create_default_models_routes() {

    // create configration Template model
   await Operations.createModelInstance(configTemplateProps)
   // create configration Routes with configController
   await ConfigRoutes();

    // create account roles
    await Operations.createModelConfigRoute(roleConfigSchema)

    // create account model config and routes
    await Operations.createModelWithConfig(accConfgSchema);
    await AccountRoutes()

    // load models routes from default directory
   await Operations.createModelsRoutesFromDirectory();
   
   // create models routes from default db
    await Operations.createModelsRoutesFromDb()


  }

  // ============ DbModel
  static async createModelInstance(_config: IModelConfigParameters) {
    let _model = new ModelDb(_config);
    return Promise.resolve(_model);
  }
  static async createModelWithConfig(_config: IModelConfigParameters) {
    let _model = await Operations.createModelInstance(_config);
    await  _model.createConfig();
    return _model;
  }

  // ===================== Routes
  static async createRouteInstance(controller: IController, callback?: IRouteCallback) {
    return Promise.resolve(new DefaultRoutesConfig(controller, callback));
  }
  
  static async createModelConfigRoute(_config: IModelConfigParameters, controller?: IController, routeCallback?: any) {

    let _model = await Operations.createModelWithConfig(_config);

    return await Operations.createRouteInstance(controller ?? new DefaultController(_model.name), routeCallback);

  }

  // create model route from config 
  static async createModelsRoutesFromDb(){
   let allDbConfigs = await Store.db.get('config')!.model!.find();
   allDbConfigs = allDbConfigs.filter((p:IModelConfig)=> !Store.db.exist(p.name));

   if(allDbConfigs.length)
   for await( let config of allDbConfigs){
   await Operations.createModelInstance(config)
    await Operations.createRouteInstance(new DefaultController(config.name))
 };

  }
  // create or override model config route
  static async overrideModelConfigRoute(_config: IModelConfigParameters) {
    let dbName = _config.name;
    if (!dbName || !Store.db.exist(dbName)) {
      envs.throwErr(' db model name not found')
    }

    // delete model if exists
    Store.db.delete(dbName);

    return await Operations.createModelConfigRoute(_config);
  }

  static async createModelFromJsonString(jsonString: string) {
    if (typeof jsonString === 'string') {
      let _conf: IModelConfigParameters = JSON.parse(jsonString);
      return await Operations.createModelConfigRoute(_conf);
    } else {
      throw new Error('this method makeModelFromJsonString require json data as string');
    }
  }

  static async createModelFromJsonFile(filePath: string) {
    if (path.isAbsolute(filePath) && Operations.isJsonFile(filePath)) {

      let data = fs.readFileSync(filePath, 'utf8');
      let jsobj: IModelConfig = JSON.parse(data);

      return await Operations.createModelConfigRoute(jsobj);
    } else {
      // handel dirNames within files
      if (path.dirname(filePath)) {
        console.log(' found dir name in : ' + path.dirname(filePath));
        await Operations.createModelsRoutesFromDirectory(filePath);
      } else {
        throw new Error('file should be json and absolute' + filePath);
      }
    }
    throw new Error('file should be json and absolute' + filePath);
  }

  // if no directory provided will use default directory
  static async createModelsRoutesFromDirectory(directory: string = envs.schemaDir()) {

    if (fs.existsSync(directory)) {
      return await Promise.all(fs.readdirSync(directory).map(async (fileName: string) => {
        let _file = path.join(directory, fileName);
        if (Operations.isJsonFile(_file)) {
          return await Operations.createModelFromJsonFile(_file);
        }
        return;
      }));
    } else {
      //throw new Error('directory Not Found : ' + directory);
      envs.logLine(`(( createModelsRoutesFromDirectory )) => Directory not found : ${directory}`)
      return null;
    }
  }


  // helpers :.............................................
  static isJsonFile(file: string) {
    return path.extname(file) === '.json';
  }

  static async validateSchema(schemaObj: IModelConfigParameters) {

    for await (let item of Object.entries(schemaObj)) {
      await this.deepSearch(item);
    }
    //  return iconfig;
  }
  // search item in object and map to mongoose schema
  static isValidType(value: any) {
    return 'number, string, boolean'.indexOf(typeof value) !== -1;
  }
  // search item in object and map to mongoose schema
  static async deepSearch(item: any) {

    // loop over the item
    for (let [itemIndex, itemValue] of Object.entries(item)) {

      // check if item is object then call deepSearch agin recursively
      if (typeof itemValue === "object") {
        await this.deepSearch(itemValue);
      } else {

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
