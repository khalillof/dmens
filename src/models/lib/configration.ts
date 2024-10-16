"use strict";
import mongoose from 'mongoose';
import { IModelConfigParameters} from '../../interfaces/index.js';

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
}

export const configTemplateSchema = {

  name: {
    "type": String,
    "unique": true,
    "lowercase": true,
    "required": true,
    "minLength": 3,
    "maxLength": 30
  },

  dependent: {
    "type": Boolean,
    "default": false
  },
  schemaOptions: {
    "type": Object,
  },
  schemaObj: {
    "type": Object,
    "required":true
  },
  routeName: {
    "type": String,
    "unique": true,
    "lowercase": true,
    "minLength": 3,
    "maxLength": 30
  },
  userAuth: {
    "type": [String],
    "default": []
  },
  adminAuth: {
    "type": [String],
    "default": []
  },
  plugins: {
    "type": [String],
    "default": []
  },
  modelTemplate: {
    "type": String
  },
  listTemplate: {
    "type": String
  }
};

export const configTemplateProps: IModelConfigParameters = {
  name: "config",
  dependent: false,
  schemaOptions: { timestamps: true, strict: true },
  schemaObj: configTemplateSchema,
  userAuth: ['list', 'get', 'create', 'update', 'delete', 'patch', 'search', 'count', 'routes', 'forms'],
  adminAuth: ['list', 'get', 'create', 'update', 'patch', 'delete', 'search', 'count', 'routes', 'forms'],
  plugins: ['comment', 'like']
};

export const roleConfigSchema = {
  name: "role",
  dependent: true,
  userAuth: ['list', 'create', 'update', 'patch', 'delete', "search", "count"],
  adminAuth: ['create', 'update', 'patch', 'delete', "search", "count"],
  schemaObj: {
    "name": {
      "type": "String",
      "unique": true,
      "lowercase": true,
      "required": true,
      "minLength": 3,
      "maxLength": 30,
      "tag": "input",
      "className": "form-control"
    }
  }
}
export const accConfgSchema:IModelConfigParameters = {
  name: "account",
  dependent: false,
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
    roles: [
      {
        "type": mongoose.Types.ObjectId,
        "ref": "role",
        "autopopulate": true
      }
    ]
  },
  userAuth: ['list', 'get', 'update', 'patch', 'delete', "search", "count"],
  adminAuth: ['list', "search", "count"],
};