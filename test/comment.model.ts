const mongoose = require('mongoose');

export interface Comment {
    rating: number;
    comment: string;
    author: string;
    date: string;
}

export const CommentSchema = {
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
};