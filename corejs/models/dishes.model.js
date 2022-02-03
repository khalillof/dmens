"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { Schema } = require("mongoose");
const DishSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: String,
        required: true,
        default: '0'
    },
    featured: {
        type: Boolean,
        default: false
    },
    descriptions: {
        type: String,
        required: true
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

exports.DishSchema = DishSchema;