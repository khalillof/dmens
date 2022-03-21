"use strict";

exports.LeaderSchema = {
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: ''
    },
    abbr: {
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
    }
};