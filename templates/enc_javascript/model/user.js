import { model, Schema, Model, Document, Types } from 'mongoose';


const userSchema = new Schema({

  email: {
    type: String,
    required: false,
    trim: true,
    unique : true
  },
  userName: {
    type: String,
    required: false,
    trim: true
  },
  addedBy: {
    ref : 'user', 
    type: Types.ObjectId,
    required: false,
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  compnyName: {
    type: String,
    required: false,
    trim: true
  },
  compnyLogo: {
    type: String,
    required: false,
    trim: true
  },
  password: {
    type: String,
    required: false,
    trim: true
  },
  tempPassword: {
    type: String,
    required: false,
    trim: true
  },
  tempPasswordExpireAt: {
    type: Number,
    required: false,
  },
  tempPasswordGenerate	: {
    type: Number,
    required: false,
    default : 0
  },
  tempPasswordStatus	: {
    type: Number,
    required: false,
    default : 0
  },
  image: {
    type: String,
    required: false,
    trim: true
  },
  phoneNumber: {
    type: Number,
    required: false,
    trim: true
  },
  address: {
    type: String,
    required: false,
    trim: true,
  },
  countryId: {
    ref : 'country_state_cities', 
    type: Number,
  },
  stateId: {
    ref : 'country_state_cities', 
    type: Number,
  },
  cityId: {
    ref : 'country_state_cities', 
    type: Number,
  },
  zipCode : {
    type : Number,
    required : false,
    trim : true
  },
  accountType: {
    type: Number
  },
  
  byLink : {
    type : Number,
    default: 0,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isEmailReverified : {
    type : Boolean,
    default : true
  },
  isAdminVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Number,
    default: 0,
  },
  emailToken: {
    type: String,
    required: false,
  },
  emailTokenExpiredAt: {
    type: Number,
    required: false,
  },
  authToken: {
    type: String,
    required: false,
    trim: true
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Number
  },
  createdAt: {
    type: Number
  },
  updatedAt: {
    type: Number
  },
},
);

const user = model('user', userSchema);
export default user;
