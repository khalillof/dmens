"use strict";
const { Schema }= require('mongoose');

const CommentSchema = {
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
};

exports.CommentSchema = CommentSchema;