"use strict";
//import { nanoid } from 'nanoid'
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
//const mySchema = new Schema({
//  _id: {
//    type: String,
//   default: () => nanoid()
//}
//})
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3B1cmV0cy9tb2RlbHMvdXNlci5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUNBQWlDOzs7QUFlakMsK0JBQStCO0FBQy9CLFVBQVU7QUFDVixtQkFBbUI7QUFDbEIsNEJBQTRCO0FBQzNCLEdBQUc7QUFDTCxJQUFJO0FBRVMsUUFBQSxVQUFVLEdBQUc7SUFDeEIsUUFBUSxFQUFDO1FBQ1AsSUFBSSxFQUFFLE1BQU07UUFDVixNQUFNLEVBQUUsSUFBSTtRQUNaLFNBQVMsRUFBQyxDQUFDO1FBQ1gsU0FBUyxFQUFDLEVBQUU7S0FDZjtJQUNELFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLEVBQUU7UUFDWCxTQUFTLEVBQUMsRUFBRTtLQUNiO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsRUFBRTtRQUNYLFNBQVMsRUFBQyxFQUFFO0tBQ2I7SUFDRCxLQUFLLEVBQUU7UUFDSCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxFQUFFO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixNQUFNLEVBQUUsSUFBSTtRQUNaLFNBQVMsRUFBQyxFQUFFO0tBQ2I7SUFDSCxZQUFZLEVBQUc7UUFDWCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxFQUFFO1FBQ1gsU0FBUyxFQUFDLEdBQUc7S0FDZDtJQUNILFFBQVEsRUFBQztRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLEVBQUU7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLFNBQVMsRUFBQyxDQUFDO0tBQ1o7SUFDSCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxFQUFFO0tBQ1o7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxLQUFLO0tBQ2Y7SUFDRCxTQUFTLEVBQUM7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFO0tBRS9CO0lBQ0QsU0FBUyxFQUFDO1FBQ1IsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRTtLQUUvQjtDQUVGLENBQUMifQ==