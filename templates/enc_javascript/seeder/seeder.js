import mongoose, { models } from 'mongoose';
import { config } from 'dotenv';
import { decrypt } from '../helpers/Crypto.js';
import UserSeeder from './user.seeder.js';
mongoose.set('strictQuery', false);
require('dotenv').config();
let userSeeder = new UserSeeder();

var DB_URL = process.env.DB_URL;
var decryptDbUrl = decrypt(DB_URL)
config();

// MongoDB connection
MongodbConnection().then(() => {
  console.log("database connected suceessfully!");
  seedDB();
}).catch((err) => {
  console.log("Failed to connect Database !!!!", err);
  process.exit(1);
});
async function MongodbConnection() {
  // Set up Mongoose connection
  await mongoose.connect(decryptDbUrl);
}

async function seedDB() {
  // let user = await userSeeder.seedDB();
  mongoose.connection.close();
  process.exit(1);
}