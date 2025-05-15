"use strict";
import { SchemaTypes, Schema, model} from 'mongoose';
import {pluralize, IEndPoint, IEndPointRoute, IConfigration, IConfigParameters, IMetaData, IModel, IRequestFilter, IRouteData, appActions, IExecWithSessionCallback, ICleanExecWithSessionCallback } from '../../common/index.js';
import { ConfigRoutesCallback, DefaultRoutesConfig } from '../../routes/index.js';

// https://www.slingacademy.com/article/sorting-results-in-mongoose-by-date/
// https://blog.devgenius.io/typescript-in-mongoose-9994fca6987b
export const mongooseListTypes = [
  "String",
  "Number",
  "BigInt",
  "Date",
  "Binary",
  "Boolean",
  "Mixed",
  "ObjectId",
  "Array",
  "DocumentArray",
  "Decimal",
  "Map"
]
export const mongooseTypeMappings = {
  "String": SchemaTypes.String,
  "Number": SchemaTypes.Number,
  "BigInt": SchemaTypes.BigInt,
  "Date": SchemaTypes.Date,
  "Binary": SchemaTypes.Buffer,
  "Boolean": SchemaTypes.Boolean,
  "Mixed": SchemaTypes.Mixed,
  "ObjectId": SchemaTypes.ObjectId,
  "Array": SchemaTypes.Array,
  "DocumentArray": SchemaTypes.DocumentArray,
  "Decimal": SchemaTypes.Decimal128,
  "Map": SchemaTypes.Map,
}
// model static methos =======================
export async function toList(this: IModel, query: IRequestFilter) {
  let { filter, limit, page, orderby, sort} = query;
  return await this.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [orderby]: sort }) // sort, use 1 for asc and -1 for dec
    .exec();
}

export async function execWithSessionAsync(this: IModel, callback: IExecWithSessionCallback, cleanJob?: ICleanExecWithSessionCallback) {
  const session = await this.startSession();

  try {
    if (typeof callback != 'function') {
      throw new Error('execWithSessionAsynce require function callback')
    }

    console.log('started session transaction =============>');

    session.startTransaction();
    console.log('started session transaction =============>');

    let transactionResult = await callback.call(this, session);

    await session.commitTransaction();

    console.log('transactionResult commited =============>\n', Object.keys(transactionResult));
    return transactionResult;

  } catch (error) {

    await session.abortTransaction();
    console.log(' Aborted transaction commited =============>');

    if (typeof cleanJob === 'function') {
      await cleanJob.call(this);
    }
    console.error(error);

    throw error;
  } finally {

    await session?.endSession();
    console.log('ended session transaction =============>');
  }
}
export async function getMetaData(this: IModel, _schema?: Schema): Promise<IMetaData> {

  let properties: Record<string, any> = {};

  (_schema ?? this.schema).eachPath(async (path:any, stype) => {
    let { instance, options } = stype;
    if (stype.schema) {
      properties[path] = [await this.getMetaData(stype.schema)];
    } else {
      delete options['type'];

      properties[path] = { instance, options: { ...options } };
    }
  });

  return { properties, requiredProperties: this.schema.requiredPaths() }
}
// end of static methods ===================

const endPointRouteSchema = new Schema<IEndPointRoute>({
  method: {
    "type": String,
    required: true,
    enum: ["get", "post", "put", "delete"],
    default: "get"
  },
  path: { "type": String, default: '', trim: true },
  paramId: { "type": String },
  authorize: { "type": Boolean, default: false },
  admin: { "type": Boolean, default: false },
  passAuth: { "type": Boolean, default: false },
  headers: {
    "type": Map,
    of: String
  }
}, { strict: true });

const endPointSchema = new Schema<IEndPoint>({
  name: {
    "type": String,
    unique: true,
    required: true,
    minLength: 3,
    maxLength: 30,
    tagName: "text"
  },
  isActive: {
    "type": Boolean,
    default: true
  },
  host: {
    "type": String,
    unique: true,
    lowercase: true,
    required: true,
    minLength: 10,
    maxLength: 200,
    tagName: "text"
  },
  routes: [endPointRouteSchema]
}, { strict: true }).index({ name: 'text', host: 'text' });

export const configSchema = new Schema<IConfigration, IModel>({

  name: {
    "type": SchemaTypes.String,
    "unique": true,
    "lowercase": true,
    "required": true,
    "minLength": 3,
    "maxLength": 30
  },
  routeName: {
    "type": SchemaTypes.String,
    "unique": true,
    "lowercase": true,
    "minLength": 3,
    "maxLength": 30,
    default: function () {
      return pluralize(this.name);
    }
  },
  paramId: {
    "type": SchemaTypes.String,
    "minLength": 3,
    "maxLength": 30,
    default: function () {
      return this.name + 'Id';
    }
  },
  isArchieved: {
    "type": Boolean,
    default: false
  },
  disableRoutes: {
    "type": Boolean,
    default: false
  },
  queryKey: {
    "type": String
  },
  tags: {
    "type": [String],
    default: []
  },
  schemaOptions: {
    "type": SchemaTypes.Map,
    of: String,
    default: function () {
      return new Map([['timestamps', true], ['strict', true], ['strictQuery', true]]);
    }
  },
  schemaObj: {
    "type": SchemaTypes.Mixed,
    "required": true,
    default: {}
  },
  recaptcha:{"type": SchemaTypes.Mixed},
  endPoints: {
    "type": [endPointSchema],
    default: []
  },
  limit: {
    "type": Number,
    "default": 5,
    min: 1,
    max: 100
  },
  orderby: {
    "type": String,
    default: "createdAt",
  },
  sort: {
    "type": String,
    enum: ['asc', 'desc', 'ascending', 'descending', '1', '-1', -1, 1],
    default: 'asc',
  },
  authorize: {
    "type": Map,
    of: Boolean,
    default: {},
    validate: {
      validator: async function (v: Map<string, boolean>) {
        let result = true;
        for await (let i of v.keys()) {
          if (!appActions.isFound(i)) {
            result = false;
            break;
          }
        }
        return result;
      },
      message: (props) => `one of action key is not valid action!`
    }
  },
  textSearch: {
    "type": [String],
    of: String,
    "default": []
  },
  disabledActions: {
    "type": [String],
    of: String,
    enum: appActions,
    default: []
  },
  modelTemplates: {
    "type": SchemaTypes.Map,
    of: String
  },

}, { timestamps: true, strict: true, strictQuery: true }).index({ name: 'text' });



configSchema.method('getRouteData', function getRouteData(): IRouteData {

  let { name, routeName, paramId, limit, sort, orderby, authorize } = this;

  return { name, routeName, paramId, limit, sort, orderby, authorize }
});
configSchema.method('getViewData', async function getViewData() {

  let { queryKey, textSearch, tags, modelTemplates } = this;

  return { queryKey, tags, textSearch, modelTemplates };
});

configSchema.statics = { toList, getMetaData, execWithSessionAsync };

//configSchema.statics['getMetaData'] = getMetaData;

const configTemplateProps: IConfigParameters = {
  name: "config",
  //disableRoutes: false,
  queryKey: "name",
  tags: [],
  schemaOptions: { timestamps: true, strict: true },
  schemaObj: {},
  endPoints: [{
    name: 'wow',
    host: "https://auth.tuban.me/",
    routes: [{
      method: "get",
      path: '.well-known/openid-configuration',

    }]
  }],
  authorize:
  {
    "list": true,
    "get": true,
    "create": true,
    "update": true,
    "delete": true,
    "search": true,
    "count": true,
    "addRoute": true,
    "removeRoute": true,
    "enableRoutes": true,
    "disableRoutes": true,

  }

};

export const configDb = model<IConfigration, IModel>("config", configSchema);
/*
configDb.execWithSessionAsync(async function(session){
// run any job with session
 await this.findByIdAndUpdate('fdfd',{},{session})
}, async function() {
  // run clean operation when error occur
})
*/

/*
// watch changes to Streams 
configDb.watch().on('change',function(data){
  data.
console.log('<<<<<<<<<<<< Configration change stream logger >>>>>>>>>: \n',data)
})
*/

configDb.findOne({ name: 'config' })
  .then(async function (config) {

    if (!config) {
      config = await configDb.create(configTemplateProps);
    }
    // create routes
    if (!config.disableRoutes)
      new DefaultRoutesConfig(config, ConfigRoutesCallback)

  });