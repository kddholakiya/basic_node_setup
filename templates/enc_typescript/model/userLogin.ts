import { model, Schema, Model, Document, Types } from 'mongoose';

export interface IUserLogin extends Document {
  _id: String;
  userId: String;
  authToken: String;
  originalPassword : Boolean;
  deviceType:String;
  mobileFcmToken: String;
  createdAt: Number;
  updatedAt: Number;
}

const userLoginSchema: Schema = new Schema({
    userId: {
    type: Types.ObjectId,
    ref:"User",
    required: true
  },
  authToken: {
    type: String,
    required: true,
    default:"",
    trim: true
  },
  originalPassword: {
    type: Boolean,
  },
  deviceType: {  // 1 : Mobile  , 2 : Web
    type: String,
    required: true  
  },
  mobileFcmToken: {
    type: String,
    required: false,
    default:null,
    trim: true
  },
  createdAt: {
    type: Number
  },
  updatedAt: {
    type: Number
  },
},
  // { timestamps: true }
);

const userLogin: Model<IUserLogin> = model<IUserLogin>('userLogin', userLoginSchema);
export default userLogin;
