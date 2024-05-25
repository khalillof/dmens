"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accConfgSchema = exports.roleConfigSchema = exports.configTemplateProps = exports.configTemplateSchema = exports.typeMappings = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
exports.typeMappings = {
    "String": mongoose_1.default.SchemaTypes.String,
    "string": mongoose_1.default.SchemaTypes.String,
    "Number": mongoose_1.default.SchemaTypes.Number,
    "number": mongoose_1.default.SchemaTypes.Number,
    "Date": mongoose_1.default.SchemaTypes.Date,
    "date": mongoose_1.default.SchemaTypes.Date,
    "Binary": mongoose_1.default.SchemaTypes.Buffer,
    "binary": mongoose_1.default.SchemaTypes.Buffer,
    "Boolean": mongoose_1.default.SchemaTypes.Boolean,
    "boolean": mongoose_1.default.SchemaTypes.Boolean,
    "mixed": mongoose_1.default.SchemaTypes.Mixed,
    "Mixed": mongoose_1.default.SchemaTypes.Mixed,
    "_id": mongoose_1.default.SchemaTypes.ObjectId,
    "id": mongoose_1.default.SchemaTypes.ObjectId,
    "ObjectId": mongoose_1.default.SchemaTypes.ObjectId,
    "objectid": mongoose_1.default.SchemaTypes.ObjectId,
    "array": mongoose_1.default.SchemaTypes.Array,
    "Array": mongoose_1.default.SchemaTypes.Array,
    "decimal": mongoose_1.default.SchemaTypes.Decimal128,
    "Decimal": mongoose_1.default.SchemaTypes.Decimal128,
    "map": mongoose_1.default.SchemaTypes.Map,
    "Map": mongoose_1.default.SchemaTypes.Map,
};
exports.configTemplateSchema = {
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
        "required": true
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
exports.configTemplateProps = {
    name: "config",
    dependent: false,
    displayName: "Configrations",
    schemaOptions: { timestamps: true, strict: true },
    schemaObj: exports.configTemplateSchema,
    useAuth: ['list', 'get', 'create', 'update', 'delete', 'patch', 'search', 'count', 'routes', 'forms'],
    useAdmin: ['list', 'get', 'create', 'update', 'patch', 'delete', 'search', 'count', 'routes', 'forms'],
    postPutMiddlewares: ['isJson'],
    plugins: ['comment', 'like']
};
exports.roleConfigSchema = {
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
};
exports.accConfgSchema = {
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
                "type": mongoose_1.default.Types.ObjectId,
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
};
