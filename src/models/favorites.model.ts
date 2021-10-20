const mongoose = require('mongoose');
import { Dish } from './dishes.model';
import { User } from './user.model';

export interface Favorite {
    user: User;
    dishes: Dish[];
    createdAt: string;
    updatedAt: string;
}
////////////////////////
export interface FavoriteExists {
    exists: boolean;
    favorites: Favorite;
}
///////////////////////////
export const FavoriteSchema ={
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    ]
};