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
  description: {
    "type": String,
    "required": false,
    "minLength": 3,
    "maxLength": 200
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
  displayName: {
    "type": String,
    "minLength": 3,
    "maxLength": 50
  },
  routeName: {
    "type": String,
    "unique": true,
    "lowercase": true,
    "minLength": 3,
    "maxLength": 30
  },
  useAuth: {
    "type": [String],
    "default": []
  },
  useAdmin: {
    "type": [String],
    "default": []
  },
  postPutMiddlewares: {
    "type": [String],
    "default": []
  },
  removeActions: {
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
  displayName: "Configrations",
  schemaOptions: { timestamps: true, strict: true },
  schemaObj: configTemplateSchema,
  useAuth: ['list', 'get', 'create', 'update', 'delete', 'patch', 'search', 'count', 'routes', 'forms'],
  useAdmin: ['list', 'get', 'create', 'update', 'patch', 'delete', 'search', 'count', 'routes', 'forms'],
  postPutMiddlewares: ['isJson', 'uploadSchema'],
  plugins: ['comment', 'like']
};

export const roleConfigSchema = {
  name: "role",
  dependent: true,
  useAuth: ['list', 'create', 'update', 'patch', 'delete', "search", "count"],
  useAdmin: ['create', 'update', 'patch', 'delete', "search", "count"],
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
export const accConfgSchema = {
  name: "account",
  dependent: false,
  displayName: "Accounts",
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
  },
  useAuth: ['list', 'get', 'update', 'patch', 'delete', "search", "count"],
  useAdmin: ['list', "search", "count"],
};

const FormDefaults = {
  parentClassname: "form-floating",
  labelClassNames: {
    text: "form-label",
    select: "form-label",
    textarea: "form-label",
    date: "form-label",
    checkbox: "form-check-label",
    radio: "form-check-label"
  },
  input: {
    text: {
      type: "text",
      class: "input-control",
      required: false,
      minLength: 3,
      maxLength: 50
    },
    checkbox: {
      type: "checkbox",
      class: "form-check",
      required: false
    },
    radio: {
      type: "radio",
      class: "form-check",
      required: false
    }
  },
  select: {
    class: "form-select",
    required: false
  },
  textarea: {
    class: "input-control",
    rows: 4,
    required: false,
    minLength: 3
  },
  date: {
    class: "input-control",
    required: false
  }
}