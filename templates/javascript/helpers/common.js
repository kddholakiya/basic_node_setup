import jwt, { decode } from "jsonwebtoken";
import { HttpCodes } from "./responseCodes.js";
import { Types } from 'mongoose';
import smtpTransport from 'nodemailer-smtp-transport';
import nodemailer from 'nodemailer';
import uuid4 from "uuid4";
import { createCipheriv, createDecipheriv } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import * as CryptoJS from "crypto-js";
import user from "../model/user.js";
import userLogin from "../model/userLogin.js";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// const decryptHost = decrypt(process.env.emailHost)
// const emailPort = decrypt(process.env.emailPort)
// const decryptEmailUser = decrypt(process.env.emailUser)
// const decryptEmailPassword = decrypt(process.env.emailPassword)





// const transporter = nodemailer.createTransport(smtpTransport({
//   host: decryptHost,
//   port: Number(emailPort),
//   secure: true,
//   auth: {
//     user: decryptEmailUser,
//     pass: decryptEmailPassword
//   }
// }));



export default class CommanController {
  constructor() {
    this.getEpoch = this.getEpoch.bind(this);
    this.CreateJwt = this.CreateJwt.bind(this);
    this.VerifyJwt = this.VerifyJwt.bind(this);
    this.CheckValidationError = this.CheckValidationError.bind(this);
    // this.SendMail = this.SendMail.bind(this);
    this.commonResponse = this.commonResponse.bind(this);
    this.encryptVerifyToken = this.encryptVerifyToken.bind(this);
    this.UUID = this.UUID.bind(this);
  }



  async getEpoch() {
    return Math.floor(Date.now() / 1000);
  }

  async commonResponse(res, error, result) {
    if (error) {
      res.status(200).json({ status: false, message: res.__("api.errors.SomethingWrong"), code: HttpCodes['BAD_REQUEST'], data: error, total: 0 });
    } else {
      if (result && result.status === "customError") {
        res.status(200).json({ status: false, message: res.__(`api.errors.${result.msg}`), code: result.code, data: result.data, total: result?.total });
      } else {
        res.status(200).json({ status: true, message: res.__(`api.msg.${result.msg}`), code: result.code, data: result.data, total: result?.total, pageNumber: result?.pageNumber });
      }
    }
  }

  //create jwt newToken
  async CreateJwt(data) {
    const decryptApisecretkey = decrypt(process.env.jwtSecret);
    const decryptJWT_EXPIRATION = decrypt(process.env.JWT_EXPIRATION)
    console.log(decryptJWT_EXPIRATION, "expiretime");
    return jwt.sign(data, decryptApisecretkey, { expiresIn: decryptJWT_EXPIRATION });;
  }

  //create verify token
  async encryptVerifyToken() {
    let verifyToken = uuid4();
    return verifyToken;
  }

  // Verify jwt token
  async VerifyJwt(req, res, next) {
    try {
      let token
      let accessKey;
      token = req.headers['authorization']
      accessKey = req.headers['x-access-key'];

      if (!token && token == null && token == undefined && !accessKey && accessKey == null && accessKey == undefined) {
        return res.status(200).json({ status: false, message: res.__("api.errors.TokenNotProvided"), code: HttpCodes['UNAUTHORIZED'] });
      } 
      let decryptToken;

      const KEY = process.env.chadb_url + process.env.hard_cord_url + '62';
      const IV = process.env.snap_art + process.env.sudo_apply + 'vn';

      const decryptWebKey = decrypt(process.env.WebKey);  // adbohkjfbdshjbsdjffkbj use this value for swagger 
      const decryptMobileKey = decrypt(process.env.mobileKey)

      if (accessKey == decryptWebKey) {
        req['body']['type'] = 1
        req['bodyType'] = 1
        req['userToken'] = decryptToken

      } else if (accessKey == decryptMobileKey) {
        req['body']['type'] = 2
        req['bodyType'] = 2
        req['userToken'] = decryptToken
      }
      const decryptApisecretkey = process.env.jwtSecret
      const decoded = jwt.verify(decryptToken, decryptApisecretkey)
      const checkUserExist = await user.findOne({ _id: new Types.ObjectId(decoded['_id']), isDelete: false })
      if (!checkUserExist) {
        return res.status(200).json({
          status: false,
          message: res.__("api.errors.notValid"),
          code: HttpCodes['UNAUTHORIZED']
        });
      }
      if (decoded) {
        const currentTime = await this.getEpoch()
        let users = await userLogin.findOne({ authToken: decryptToken });
        if (users.originalPassword == false && (Number(checkUserExist.tempPasswordExpireAt) < Number(currentTime))) {
          return res.status(200).json({
            status: false,
            message: res.__("api.errors.tempPasswordExpire"),
            code: HttpCodes['UNAUTHORIZED']
          });
        }
        if (users && users !== null && users !== undefined) {
          req['user'] = decoded
           next();
        } else {
       return res.status(200).json({ status: false, message: res.__("api.errors.sessionExpire"), code: HttpCodes['UNAUTHORIZED'] });
        }
      } else {
       return res.status(200).json({ status: false, message: res.__("api.errors.InvalidToken"), code: HttpCodes['UNAUTHORIZED'] });
      }
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
      return res.status(401).json({ status: false, message: res.__("api.errors.sessionExpire"), code: HttpCodes['UNAUTHORIZED'] });
      }else{
       return res.status(200).json({ status: false, message: res.__("api.errors.InvalidToken"), code: HttpCodes['UNAUTHORIZED'] });
      }
    }
  }


  async generateRandomPassword() {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%&*?';
    const numbers = '0123456789';
    const length = 8
    const allChars = lowercaseChars + uppercaseChars + specialChars + numbers;
    let password = '';

    // Ensure at least one character from each category
    password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    // Fill the rest of the password with random characters
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the characters to make it more random
    password = password.split('');
    for (let i = password.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
  }

  // Created Send Mail Function to send OTP in Email.
  // async SendMail(tempatePath: any, emailData: any) {
  //   const compiledTemplate = ejs.compile(tempatePath);
  //   const renderedTemplate = compiledTemplate(emailData);
  //   var decryptEmailFrom = decrypt(process.env.emailFrom)
  //   var mailOptions = {
  //     from: decryptEmailFrom,
  //     to: emailData.to,
  //     subject: emailData.subject,
  //     html: renderedTemplate
  //   };
  //   return new Promise((resolve, reject) => {
  //     transporter.sendMail(mailOptions, function (error: any, data: any) {
  //       if (error) {
  //         console.log(error);
  //         resolve({ status: false, data: null });
  //       } else {
  //         resolve({ status: true, data: data });
  //       }
  //     });
  //   });
  // }

  /// check validation error before API responce
  async CheckValidationError(req, res, next) {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ status: false, message: res.__(`api.errors.${errors.array()[0].msg}`), code: HttpCodes['CONTENT_NOT_FOUND'], data: {} });
    } else {
      next();
    }
  }


  async UUID() {
    return uuidv4();;
  }

}