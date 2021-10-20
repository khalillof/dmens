//import { nanoid } from 'nanoid'

export interface User {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  facebookId?: string,
  admin: boolean,
  permissionLevel?: number;
  createdAt: string;
  updatedAt: string;
}

//const mySchema = new Schema({
//  _id: {
//    type: String,
 //   default: () => nanoid()
  //}
//})

export const UserSchema = {
  username:{
    type: String,
      unique: true,
      minLength:3,
      maxLength:50
  },
  firstname: {
    type: String,
    default: '',
    maxLength:50
  },
  lastname: {
    type: String,
    default: '',
    maxLength:50
  },
  email: {
      type: String,
      default: '',
      required: false,
      unique: true,
      maxLength:50
    },
  descriptions : {
      type: String,
      default: '',
      maxLength:150
    },
  password:{
      type: String,
      default: '',
      required: true,
      minLength:3
    },
  facebookId: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  },
  createdAt:{
    type: String,
    default: Date.now().toString()

  },
  updatedAt:{
    type: String,
    default: Date.now().toString()

  }

};


