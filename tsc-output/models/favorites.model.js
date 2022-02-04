"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteSchema = void 0;
const mongoose = require('mongoose');
///////////////////////////
exports.FavoriteSchema = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF2b3JpdGVzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vcHVyZXRzL21vZGVscy9mYXZvcml0ZXMubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBZXJDLDJCQUEyQjtBQUNkLFFBQUEsY0FBYyxHQUFFO0lBQ3pCLElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1FBQ3BDLEdBQUcsRUFBRSxNQUFNO0tBQ2Q7SUFDRCxNQUFNLEVBQUU7UUFDSjtZQUNJLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQ3BDLEdBQUcsRUFBRSxNQUFNO1NBQ2Q7S0FDSjtDQUNKLENBQUMifQ==