"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { Schema } = require("mongoose");

const FavoriteSchema = {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Dish'
        }
    ]
};

exports.FavoriteSchema = FavoriteSchema;