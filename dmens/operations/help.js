"use strict";
import mongoose from 'mongoose';
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
};
export const confSchema = {
    name: {
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
    useAuth: {
        "type": [String],
        "default": []
    },
    useAdmin: {
        "type": [String],
        "default": []
    },
    schemaOptions: {
        "type": Object,
    },
    schemaObj: {
        "type": Object,
        "required": true
    }
};
export const accConfgSchema = {
    name: "account",
    active: true,
    useAuth: ["list", "get", "post", "put", "delete"],
    useAdmin: ["list"],
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
    }
};
