"use strict";
import express from 'express';
import { IConfigProps, IConfigPropsParameters, IController } from '../interfaces/index.js';
import { DbModel } from '../models/lib/json.model.js';
import path from 'path';
import fs from 'fs';
import { config } from '../common/index.js';
import { DefaultRoutesConfig, ConfigRoutes, AuthRoutes } from '../routes/index.js';
import { IRouteConfigCallback } from '../interfaces/index.js';
import { IRouteCallback } from 'src/interfaces/lib/interfaces.js';
import { confSchema, accConfgSchema, typeMappings } from './help.js';

//=============================================


export class Configration {

  static async create_default_models_routes(app: express.Application) {
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
    await Configration.createInstanceWithRouteConfigCallback(app, ConfigRoutes);

    // create account model config and routes
    await Configration.createModelWithConfigAndRoutes(app, accConfgSchema);

    // auth routes
    await Configration.createInstanceWithRouteConfigCallback(app, AuthRoutes);
    // load models routes from default directory
    return await Configration.createModelsRoutesFromDirectory(app);

  }

  // ============ DbModel
  static async createModelInstance(_config: IConfigPropsParameters, callback?: any) {
    return Promise.resolve(new DbModel(_config, callback));
  }


  static async createModelWithConfigAndRoutes(app: express.Application, _config: IConfigPropsParameters, controller?: IController, routeCallback?: any) {

    let _model = await Configration.createModelInstance(_config);
    await _model.createConfig();

    return await Configration.createRouteInstance(app, _model.name, controller, routeCallback);

  }

  static async createModelFromJsonString(app: express.Application, jsonString: string) {
    if (typeof jsonString === 'string') {
      let _conf: IConfigPropsParameters = JSON.parse(jsonString);
      return await Configration.createModelWithConfigAndRoutes(app, _conf);
    } else {
      throw new Error('this method makeModelFromJsonString require json data as string');
    }
  }

  static async createModelFromJsonFile(app: express.Application, filePath: string) {
    if (path.isAbsolute(filePath) && Configration.isJsonFile(filePath)) {

      let data = fs.readFileSync(filePath, 'utf8');
      let jsobj: IConfigProps = JSON.parse(data);

      return await Configration.createModelWithConfigAndRoutes(app, jsobj);
    } else {
      // handel dirNames within files
      if (path.dirname(filePath)) {
        console.log(' found dir name in : ' + path.dirname(filePath));
        await Configration.createModelsRoutesFromDirectory(app, filePath);
      } else {
        throw new Error('file should be json and absolute' + filePath);
      }
    }
    throw new Error('file should be json and absolute' + filePath);
  }

  // if no directory provided will use default directory
  static async createModelsRoutesFromDirectory(app: express.Application, directory: string = config.schemaDir()) {
    if (path.dirname(directory)) {
      return await Promise.all(fs.readdirSync(directory).map(async (fileName: string) => {
        let _file = path.join(directory, fileName);
        if (Configration.isJsonFile(_file)) {
          return await Configration.createModelFromJsonFile(app, _file);
        }
        return;
      }));
    } else {
      throw new Error('directory Not Found : ' + directory);
    }
  }

  // ===================== Routes
  static async createRouteInstance(exp: express.Application, rName: string, controller?: IController, callback?: IRouteCallback) {
    return Promise.resolve(new DefaultRoutesConfig(exp, rName, controller, callback));
  }

  static async createInstanceRouteWithDefault(app: express.Application, name: string) {
    return await Configration.createRouteInstance(app, name);
  }

  static async createInstanceWithRouteConfigCallback(app: express.Application, routeCb: IRouteConfigCallback) {
    return await Configration.createRouteInstance(app, routeCb.routeName, routeCb.controller, routeCb.routeCallback);
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
