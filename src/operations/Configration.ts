"use strict";
import express from 'express';
import { IConfigProps, IConfigPropsParameters, IController } from '../interfaces/index.js';
import { DbModel } from '../models/lib/db.model.js';
import path from 'path';
import fs from 'fs';
import { dbStore, envConfig } from '../common/index.js';
import { DefaultRoutesConfig, ConfigRoutes, AuthRoutes } from '../routes/index.js';
import { IRouteConfigCallback } from '../interfaces/index.js';
import { IRouteCallback } from 'src/interfaces/lib/interfaces.js';
import { confSchema, accConfgSchema, typeMappings } from './help.js';

//=============================================


export class Configration {

  static async create_default_models_routes() {
    // create config model
    const _configProp: IConfigPropsParameters = {
      name: "config",
      active: true,
      useAuth: ["list", "get", "post", "put", "delete"],
      useAdmin: ["list", "get", "post", "put", "delete"],
      schemaOptions: { timestamps: true, strict: true },
      schemaObj: confSchema
    };
    // create config model and routes
    await Configration.createModelInstance(_configProp);
    await Configration.createInstanceWithRouteConfigCallback(ConfigRoutes);

    // create account model config and routes
    await Configration.createModelConfigRoute(accConfgSchema);

    // auth routes
    await Configration.createInstanceWithRouteConfigCallback(AuthRoutes);
    // load models routes from default directory
    return await Configration.createModelsRoutesFromDirectory();

  }

  // ============ DbModel
  static async createModelInstance(_config: IConfigPropsParameters, callback?: any) {
    return Promise.resolve(new DbModel(_config, callback));
  }


  static async createModelConfigRoute(_config: IConfigPropsParameters, controller?: IController, routeCallback?: any) {

    let _model = await Configration.createModelInstance(_config);
    await _model.createConfig();

    return await Configration.createRouteInstance(_model.name, controller, routeCallback);

  }
  // create or override model config route
  static async createOverrideModelConfigRoute(_config: IConfigPropsParameters) {
    let dbName = _config.name;
    if (!dbName) {
      envConfig.throwErr(' db model name not found')
    }

    // delete model if exists
    if (dbStore[dbName])
      delete dbStore[dbName];

    let _model = await Configration.createModelInstance(_config);
    await _model.createConfig();

    await Configration.createRouteInstance(_model.name);
    return _model;
  }

  static async createModelFromJsonString(jsonString: string) {
    if (typeof jsonString === 'string') {
      let _conf: IConfigPropsParameters = JSON.parse(jsonString);
      return await Configration.createModelConfigRoute(_conf);
    } else {
      throw new Error('this method makeModelFromJsonString require json data as string');
    }
  }

  static async createModelFromJsonFile(filePath: string) {
    if (path.isAbsolute(filePath) && Configration.isJsonFile(filePath)) {

      let data = fs.readFileSync(filePath, 'utf8');
      let jsobj: IConfigProps = JSON.parse(data);

      return await Configration.createModelConfigRoute(jsobj);
    } else {
      // handel dirNames within files
      if (path.dirname(filePath)) {
        console.log(' found dir name in : ' + path.dirname(filePath));
        await Configration.createModelsRoutesFromDirectory(filePath);
      } else {
        throw new Error('file should be json and absolute' + filePath);
      }
    }
    throw new Error('file should be json and absolute' + filePath);
  }

  // if no directory provided will use default directory
  static async createModelsRoutesFromDirectory(directory: string = envConfig.schemaDir()) {
    if (path.dirname(directory)) {
      return await Promise.all(fs.readdirSync(directory).map(async (fileName: string) => {
        let _file = path.join(directory, fileName);
        if (Configration.isJsonFile(_file)) {
          return await Configration.createModelFromJsonFile(_file);
        }
        return;
      }));
    } else {
      throw new Error('directory Not Found : ' + directory);
    }
  }

  // ===================== Routes
  static async createRouteInstance(rName: string, controller?: IController, callback?: IRouteCallback) {
    return Promise.resolve(new DefaultRoutesConfig(rName, controller, callback));
  }

  static async createInstanceWithRouteConfigCallback(routeCb: IRouteConfigCallback) {
    return await Configration.createRouteInstance(routeCb.routeName, routeCb.controller, routeCb.routeCallback);
  }


  // helpers :.............................................
  static isJsonFile(file: string) {
    return path.extname(file) === '.json';
  }

  static async validateSchema(schemaObj: IConfigPropsParameters) {

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
