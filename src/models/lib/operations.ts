"use strict";
import mongoose, { ClientSession, IndexDirection, Schema } from 'mongoose';
import { autopopulatePlugin, mongooseTypeMappings, configDb, toList, getMetaData } from '../index.js';
import { appData, envs, IConfigration, IConfigParameters, IModel, ICleanExecWithSessionCallback } from '../../common/index.js'
import path from 'path';
import fs from 'fs';
import { DefaultRoutesConfig } from '../../routes/index.js';


export async function init_models() {

  if (await configDb.countDocuments() <= 1) {
    envs.logLine(' no configrations found on database so we will try default directory');

    // create from directory
    await createFromDirectory();
    return;
  }
  // try and query operator
  /* 
  let twoInlist = await configDb.find().and([
     { $or: [{name: 'role'}, {name: 'account'}] }
   ])
   .exec();
 */

  // then do rest of models

  for await (let config of await configDb.find({ isArchieved: false })) {
    if (config.name !== 'config')
      await createMangedInstance(config)
  }

}

export async function createFromJsonString(jsonString: string) {
  if (typeof jsonString === 'string') {
    let config: IConfigParameters = JSON.parse(jsonString);
    return await createMangedInstance(config, false);
  } else {
    throw new Error('this method makeModelFromJsonString require json data as string');
  }
}

export async function createFromJsonFile(filePath: string): Promise<any> {
  if (!path.isAbsolute(filePath)) {
    throw new Error('file should be json and absolute' + filePath);
  }


  if (isJsonFile(filePath)) {

    let data = fs.readFileSync(filePath, 'utf8');
    let config: IConfigParameters = JSON.parse(data);

    return await createMangedInstance(config, false);
    // handel dirNames within files
  } else if (path.dirname(filePath)) {
    console.log(' found dir name in : ' + path.dirname(filePath));
    return await createFromDirectory(filePath);
  } else {
    throw new Error('file should be json and absolute' + filePath);
  }

}

// if no directory provided will use default directory
export async function createFromDirectory(directory: string = envs.schemaDir()) {

  if (fs.existsSync(directory)) {
    return await Promise.all(fs.readdirSync(directory).map(async (fileName: string) => {
      let _file = path.join(directory, fileName);
      if (isJsonFile(_file)) {
        return await createFromJsonFile(_file);
      }
      return;
    }));
  } else {
    //throw new Error('directory Not Found : ' + directory);
    envs.logLine(`(( createModelsRoutesFromDirectory )) => Directory not found : ${directory}`)
    return null;
  }
}
/*
export async function createConfigInstance(config: IConfigParameters, cleanJob?: ICleanExecWithSessionCallback): Promise<IConfigration> {

  if (config.name === "config") {
    throw new Error("model Config already on the database");
  }

  if (appData.has(config.name)) {
    throw new Error(`config.name :${config.name} is already on db and appData`)
  }

  if (!config.schemaObj) {
    throw new Error(' property schemaObj is required property')
  }

  if (!configDb) {
    throw new Error(`config model not present on the database, could not create config entry for model :${config.name}`)
  }

  let foundOne: any = await configDb.exists({ name: config.name });

  if (foundOne) {
    throw new Error(`model named ${foundOne['name']} already on the database`);

  } else {
    let result = await configDb.execWithSessionAsync(async function (session) {
      return await new configDb(config).save({ session });
    }, cleanJob);

    envs.logLine(`created config entry for model name : ${result.name}`);
    return result;
  }

}
*/
export async function createModelInstance(config: IConfigration) {

  let { name, schemaObj, schemaOptions, textSearch } = config;

  if (mongoose.models[name]) {
    throw new Error(`model named ${name} already exist`);
  }

  // let _options =  Object.fromEntries(schemaOptions); // will produce string error like 'true' not true

  const options = Array.from(schemaOptions).reduce((acc: Record<string, any>, [key, value]) => {
    if (value === 'true')
      value = true;
    if (value === 'false')
      value = false;

    acc[key] = value;
    return acc;
  }, {});


  let _schema = new Schema<IConfigration, IModel>(schemaObj, options).plugin(autopopulatePlugin);

  // add static method
  _schema.statics = { toList, getMetaData };

  if (textSearch?.length) {
    let obg: { [x: string]: IndexDirection } = Object.fromEntries(textSearch.map((key:any) => [key, "text"]));
    _schema.index(obg)
  }
  envs.logLine('created new data model : ' + name);

  return mongoose.model(name, _schema);


}

export async function createRouteInstance(config: IConfigration) {
  await Promise.resolve(new DefaultRoutesConfig(config))
}

export async function createMangedInstance(_config: IConfigParameters | IConfigration, configFromDb: boolean = true) {
  // Using Mongoose's default connection
  //const session = await mongoose.startSession();
  // https://moldstud.com/articles/p-mastering-transactions-in-mongoose

  if (configFromDb) {
    await createModelInstance(_config as IConfigration);
    if (!_config.disableRoutes)
      await createRouteInstance(_config as IConfigration);
  } else {

      let { name, schemaObj } = _config;

      if (name === "config") {
        throw new Error("model Config already on the database");
      }

      if (appData.has(name)) {
        throw new Error(`model name :${name} is already on db and appData`)
      }

      if (!schemaObj) {
        throw new Error(' property schemaObj is required property')
      }

      if (!configDb) {
        throw new Error(`config model not present, could not create config entry for model :${name}`)
      }

      let foundOne: any = await configDb.exists({ name });

      if (foundOne) {
        throw new Error(`model name: ${foundOne['name']} already on the database`);

      } else {

         _config = await configDb.create(_config) as IConfigration;
        envs.logLine(`created config entry for model name : ${name}`);

        await createModelInstance(_config);
        if (!_config.disableRoutes)
        await createRouteInstance(_config);

       // return _config;
      }
      // clean job
      /*
      if (mongoose.models[_config.name]) {
        mongoose.deleteModel(_config.name)
      }
      if (appData.has(_config.name)) {
        appData.get(_config.name)?.routeManager.removeAllRoutes();
        appData.delete(_config.name)
      }
       */
    
  }

  return true;
}

// helpers :.............................................
export function isJsonFile(file: string) {
  return path.extname(file) === '.json';
}

export async function validateSchema(schemaObj: IConfigParameters) {

  for await (let item of Object.entries(schemaObj)) {
    await deepSearch(item);
  }
  //  return iconfig;
}
// search item in object and map to mongoose schema
function isValidType(value: any) {
  return 'number, string, boolean'.indexOf(typeof value) !== -1;
}
// search item in object and map to mongoose schema
export async function deepSearch(item: any) {

  // loop over the item
  for (let [itemIndex, itemValue] of Object.entries(item)) {

    // check if item is object then call deepSearch agin recursively
    if (typeof itemValue === "object") {
      await deepSearch(itemValue);
    } else {

      // loop over typeMappings to map user schema string type to mongoose typings
      for (const [mapKey, mapValue] of Object.entries(mongooseTypeMappings)) {
        if (itemValue === mapKey) {
          item[itemIndex] = mapValue;
        }
        else {
          // check for the item didn't match our typemappings is valid type or raise error
          if (!isValidType(itemValue))
            throw new Error('unvalid schema type value for the key:' + item[itemIndex] + ' :' + itemValue);
        }
      }
    }

  }
}