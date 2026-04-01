import mongoose, { models } from 'mongoose';
import user, { IUser } from '../model/user.js';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import CommanController from "../helpers/common.js";
const { getEpoch } = new CommanController();
import { config } from 'dotenv';
import { decrypt } from '../helpers/Crypto.js';

// Load environment variables from .env file
config();

// Use environment variables

const documents = [
  {
    "email": "admin@admin.com",
    "name": "admin",
    "password": "Admin@12345678",
    "accountType": 1,
    "isEmailVerified": true,
    "isAdminVerified": true,
    "phoneNumber" : "0000000000",
    "address" : "Ahmedabad,Gujarat",
  },
]

export default class UserSeeder {
  constructor() {
    this.seedDB = this.seedDB.bind(this);
  }
  async seedDB() {
    return new Promise(async (resolve, reject) => {
      try {
        // Load seed data
        await user.deleteMany({});

        for (const ele of documents) {
        let data = ele;
        let salt = randomBytes(32).toString('hex');
        let hashedPassword = scryptSync(data.password, salt, 64).toString('hex');
        data['password'] = `${salt}:${hashedPassword}`;
        const userData = new user(data);
        let saveData = await userData.save();        }
        resolve(1);
      } catch (error) {
        console.log(error, "error in user seeder");
        resolve(0);
      }
    })

  }
}