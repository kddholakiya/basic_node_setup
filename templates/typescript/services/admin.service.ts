"use strict";

import { HttpCodes } from "../helpers/responseCodes";
import user, { IUser } from "../model/user";
import CommanController from "../helpers/common";
import { randomBytes, scryptSync } from "crypto";
import fs from 'fs';

const { getEpoch,  generateRandomPassword,  encryptVerifyToken,} =
    new CommanController();

var connectHost : any;

if (process.env.NODE_ENV == 'staging') {
     connectHost = process.env.socketHost;
} else if (process.env.NODE_ENV == 'development') {
     connectHost = process.env.socketHost;
}
else if (process.env.NODE_ENV == 'production') {
     connectHost = process.env.socketHost;
}

export default class adminService {

    constructor() {
        this.addUser = this.addUser.bind(this);
       
    }

 
async addUser(req: any, callback: any) {
  try {
    const currentTime = await getEpoch();

    const adminUser: IUser = await user.findOne({ _id: req.user._id, accountType: { $in: [1, 2] } });

    if (!adminUser) { return callback(null, { status: HttpCodes.API_FAILURE, msg: "InvalidAccountType", code: HttpCodes.UNAUTHORIZED, data: {} }); }

    const {
      name,
      email: rawEmail,
      phoneNumber,
      address,
      accountType,
      country,
      state,
      city,
      zipCode,
      image
    } = req.body;

    const email = rawEmail?.toLowerCase();

    // 🔹 Check email existence
    if (email) {
      const exist = await user.findOne({ email });
      if (exist) {
        return callback(null, { status: HttpCodes.API_FAILURE, msg: "", code: HttpCodes['CREATED'], data: {} });
      }
    }

    // 🔹 Validate accountType
    if (![1, 2].includes(accountType)) {
      return callback(null, { status: HttpCodes.API_FAILURE, msg: "AccountTypeRequired", code: HttpCodes.BAD_REQUEST, data: {} });
    }



    // 🔹 Generate password
    const tempPassword = await generateRandomPassword();
    const salt = randomBytes(32).toString("hex");
    const hashPassword = scryptSync(tempPassword, salt, 64).toString("hex");
    const password = `${salt}:${hashPassword}`;

    // 🔹 Token
    const token = await encryptVerifyToken();
    const expireTime = currentTime + 3600;

    // 🔹 Common user object
    const newUser: any = {
      name,
      email,
      password,
      phoneNumber,
      address,
      accountType,
      isAdminVerified: true,
      emailToken: token,
      emailTokenExpiredAt: expireTime,
      countryId: country,
      stateId: state,
      cityId: city,
      zipCode,
      image,
      createdAt: currentTime,
      addedBy: req.user._id
    };

 

    // 🔹 Send mail
    const baseUrl = `${connectHost}/verify-account`;
    const verifyLink = `${baseUrl}/${token}`;

    const mailData = {
      Name: name,
      email,
      tempPassword,
      verifyLink,
      to: email,
      subject: "Verify email for your Account"
    };

    const template = fs.readFileSync(`./views/EmailTemplate/verify-email.ejs`, 'utf8');
    // const mail: any = await SendMail(template, mailData);

    // if (!mail.status) {
    //   return callback(null, { status: HttpCodes.API_FAILURE, msg: "ErrorInMail", code: HttpCodes.BAD_REQUEST, data: {} });
    // }

    // 🔹 Save user
    const userCreate: IUser = new user(newUser);
    await userCreate.save();

    return callback(null, { status: HttpCodes.API_SUCCESS, msg: "UserCreated", code: HttpCodes.OK, data: {} });

  } catch (error) {
    return callback(null, { status: HttpCodes.API_FAILURE, msg: "SomethingWrong", code: HttpCodes.BAD_REQUEST, data: {} });
  }
}

    }

