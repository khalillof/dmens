"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.UserSchema = {
    username: {
        type: String,
        unique: true,
        minLength: 3,
        maxLength: 50
    },
    firstname: {
        type: String,
        default: '',
        maxLength: 50
    },
    lastname: {
        type: String,
        default: '',
        maxLength: 50
    },
    email: {
        type: String,
        default: '',
        required: false,
        unique: true,
        maxLength: 50
    },
    descriptions: {
        type: String,
        default: '',
        maxLength: 150
    },
    password: {
        type: String,
        default: '',
        required: true,
        minLength: 3
    },
    facebookId: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: Date.now().toString()
    },
    updatedAt: {
        type: String,
        default: Date.now().toString()
    }
};
