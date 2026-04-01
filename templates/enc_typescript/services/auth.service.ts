"use strict";

import { HttpCodes } from "../helpers/responseCodes";
import user, { IUser } from '../model/user';
import CommanController from "../helpers/common";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { decrypt } from '../helpers/Crypto';
import fs from 'fs';
import jwt from "jsonwebtoken";
import userLogin, { IUserLogin } from "../model/userLogin";

const { getEpoch, CreateJwt, encryptionData, encryptVerifyToken, generateRandomPassword,  } = new CommanController();
var connectHost: any;

if (process.env.NODE_ENV == 'staging') {
    let decryptHost = decrypt(process.env.socketHost);
    connectHost = decryptHost
} else if (process.env.NODE_ENV == 'development') {
    let decryptHost = decrypt(process.env.socketHost)
    connectHost = decryptHost
}else if (process.env.NODE_ENV == 'production') {
    let decryptHost = decrypt(process.env.socketHost)
    connectHost = decryptHost
}


export default class authService {
    constructor() {
        this.login = this.login.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.logout = this.logout.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }


    async login(data: any, callback: any) {
        try {
            const email = data?.email
            const smallCaseEmamil = email.toLowerCase();
            var currentTime: any = await getEpoch();
            let deviceType = data?.deviceType;
            const userData: IUser = await user.findOne({ $or: [{ email: smallCaseEmamil }, { userName: email }], });
            if (userData) {
               
                if (userData?.isDelete == true) {
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'userIsDeleted', code: HttpCodes['BAD_REQUEST'], data: {} });
                }
                if (userData?.isEmailVerified == false || userData?.isAdminVerified == false || userData?.isEmailReverified == false) {
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'userISNotVerified', code: HttpCodes['BAD_REQUEST'], data: {} });
                }
                if (userData?.status == 0) {
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'userIsDeactivated', code: HttpCodes['BAD_REQUEST'], data: {} });
                }
                if ((userData.accountType == 1 || userData.accountType == 2 || userData.accountType == 3) && data.type == 2) {
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'WrongCreditial', code: HttpCodes['BAD_REQUEST'], data: {} });
                }
                else {
                    const [salt, key] = userData.password.split(':');
                    const hashedBuffer:any = scryptSync(data?.password, salt, 64);
                    const keyBuffer:any = Buffer.from(key, 'hex');
                    const match = timingSafeEqual(hashedBuffer, keyBuffer);
                    if (userData?.tempPassword) {
                        const [tempSalt, tempKey] = userData?.tempPassword.split(':');
                        const tempHashedBuffer:any = scryptSync(data?.password, tempSalt, 64);
                        const tempKeyBuffer:any = Buffer.from(tempKey, 'hex');
                        var tempPasswordMatch = timingSafeEqual(tempHashedBuffer, tempKeyBuffer);
                    }
                    if (match) {
                        var tokenObj = {
                            _id: userData._id,
                            email: userData.email,
                            userName: userData.userName,
                            role: userData.accountType,
                        }
              
                        const jwt = await CreateJwt(tokenObj)
                        let loginQuery = { userId: userData?._id, deviceType: deviceType, originalPassword: true }
                        let userLoginData: IUserLogin = await userLogin.findOne(loginQuery);
                        if (userLoginData) {
                            let updateData = { authToken: jwt, updatedAt: currentTime };
                            if (deviceType == "mobile") {
                                updateData['mobileFcmToken'] = data?.mobileFcmToken;
                            }
                            let updateUserLogin = await userLogin.updateOne({ _id: userLoginData?._id }, updateData, { new: true });
                        } else {
                            var payload = {
                                userId: userData?._id,
                                deviceType: deviceType,
                                authToken: jwt,
                                originalPassword: true,
                                createdAt: currentTime
                            }
                            if (deviceType == "mobile") {
                                payload['mobileFcmToken'] = data?.mobileFcmToken;
                            }
                            const userlogin: IUserLogin = new userLogin(payload);
                            let userLoginData = await userlogin.save();
                        }

                        var resData: any = { token: jwt, userid : userData._id ,  accountType: userData.accountType, }
                        var userUpdate: any = await user.updateOne({ _id: userData?._id }, { authToken: jwt }, { new: true });
                        if (userUpdate['acknowledged']) {
                            return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'Login', code: HttpCodes['OK'], data: resData });
                        } else {
                            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'WrongCreditial', code: HttpCodes['NOT_FOUND'], data: {} });
                        }
                    } else {
                        return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'WrongCreditial', code: HttpCodes['NOT_FOUND'], data: {} });
                    }
                }
            } else {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'WrongCreditial', code: HttpCodes['NOT_FOUND'], data: {} });
            }
        } catch (error) {
            console.log(error)
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'loginFailed', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }

    async changePassword(req: any, callback: any) {
        try {
            const userData: IUser = await user.findOne({ _id: req.user._id })
            if (userData) {
                const [salt, key] = userData.password.split(':');
                const hashedBuffer: any = scryptSync(req?.body?.password, salt, 64);
                const keyBuffer :any = Buffer.from(key, 'hex');
                var match = timingSafeEqual(hashedBuffer, keyBuffer)
                if (!match) {
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'WrongCurrentPassword', code: HttpCodes["NOT_MODIFIED"], data: {} });
                }
                else {
                    const newPassword = req?.body?.newPassword;
                    if (newPassword === req?.body?.password) {
                        return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'oldAndNewPasswordSame', code: HttpCodes["NOT_MODIFIED"], data: {} });
                    }
                    const salt = randomBytes(32).toString('hex');
                    const hashedPassword = scryptSync(newPassword, salt, 64);
                    const newHashedPassword = `${salt}:${hashedPassword.toString('hex')}`;
                    var userUpdate: any = await user.updateOne({ _id: userData?._id }, { password: newHashedPassword }, { new: true })
                    if (userUpdate['acknowledged']) {
                        return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'PasswordUpdated', code: HttpCodes['OK'], data: {} });
                    } else {
                        return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['NOT_FOUND'], data: {} });
                    }
                }
            } else {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'WrongCreditial', code: HttpCodes['NOT_FOUND'], data: {} });
            }
        } catch (error) {
            (error)
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }

    async editProfile(req: any, callback: any) {
        try {
            const currentTime = await getEpoch()
            const userData: IUser = await user.findOne({ _id: req.user._id })
            if (userData) {
                const { name, phoneNumber, address, country, state, city, zipCode ,compnyName,userName} = req?.body

                if(userData.accountType == 5){
                    const findUserName = await user.findOne({userName : userName,_id : {$ne : userData._id}})
                    if (findUserName) {
                        return callback(null, {status: HttpCodes["API_FAILURE"],msg: "userNameAlreadyExist",code: HttpCodes["CREATED"],data: {},});
                      }    
                }
                const updatedData = {
                    name: name,
                    phoneNumber: phoneNumber,
                    address: address,
                    countryId: country,
                    userName : userName,
                    stateId: state,
                    cityId: city,
                    zipCode: zipCode,
                    compnyName : compnyName,
                    updatedAt: currentTime
                }
                var userUpdate: any = await user.updateOne({ _id: userData?._id }, updatedData, { new: true })
                if (userUpdate['acknowledged']) {
                    return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'ProfileUpdated', code: HttpCodes['OK'], data: {} });
                } else {
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['NOT_FOUND'], data: {} });
                }
            }
            else {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'UserNotFound', code: HttpCodes['NOT_FOUND'], data: {} });
            }
        } catch (error) {
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }

    async logout(req: any, callback: any) {
        try {
            const deviceType = req?.body?.deviceType;
            var userLoginData: IUserLogin = await userLogin.findOne({ userId: req.user._id, deviceType: deviceType, authToken: req['userToken'] })

            if (userLoginData) {
                if (userLoginData['authToken'] == '' || userLoginData['authToken'] == null) {
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
                } else {
                    let updateUserLogin = await userLogin.deleteOne({ _id: userLoginData._id }, { new: true })
                    if (!updateUserLogin['acknowledged']) {
                        return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
                    }
                    return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'LoggedOut', code: HttpCodes['OK'], data: {} });
                }
            }
            else {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'UserNotFound', code: HttpCodes['NOT_FOUND'], data: {} });
            }
        } catch (error) {
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }

  

    async forgetPassword(req: any, callback: any) {
        try {
            const email = req?.body?.email;
            const smallCaseEmail = email.toLowerCase();
            const userData = await user.findOne({ email: smallCaseEmail });
            if (!userData) {
                return callback(null, {
                    status: HttpCodes["API_FAILURE"], msg: "UserNotFound", code: HttpCodes["NOT_FOUND"], data: {},
                });
            }
            if (userData?.isEmailVerified == false || userData?.isAdminVerified == false || userData?.isEmailReverified == false) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'userISNotVerified', code: HttpCodes['BAD_REQUEST'], data: {} });
            } if (userData?.isDelete == true) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'userIsDeleted', code: HttpCodes['BAD_REQUEST'], data: {} });
            }
            else {
                const token = await encryptVerifyToken()
                const currentTime = await getEpoch();
                const expireTime = currentTime + 600;
                const updateData = { emailToken: token, emailTokenExpiredAt: expireTime }
                const userUpdate: any = await user.updateOne({ _id: userData?._id }, updateData, { new: true });
                const baseUrl = `${connectHost}/reset-password`;
                const resetLink = `${baseUrl}?token=${token}`;
                const subject = "Reset Password for Your Account";
                const mailData = {
                    Name: userData.name,
                    resetLink: resetLink,
                    to: email,
                    subject: subject

                };
                const templatePath = `./views/EmailTemplate/reset-password.ejs`;
                const template = fs.readFileSync(templatePath, 'utf8');

                // let mail: any = await SendMail(template, mailData)
                // if (mail.status == false) {
                //     return callback(null, { status: HttpCodes["API_FAILURE"], msg: "SomethingWrong", code: HttpCodes["BAD_REQUEST"], data: {}, });
                // }
                return callback(null, {status: HttpCodes.API_SUCCESS,msg: 'forgotPassword',code: HttpCodes['OK'],data: {}});
            }

        } catch (error) {
            return callback(null, {status: HttpCodes["API_FAILURE"],msg: "SomethingWrong",code: HttpCodes["BAD_REQUEST"],data: {}});
        }
    }

   

    async resetPassword(req: any, callback: any) {
        try {
            const token = req.query.token
            if (!token || token == undefined || token == '') {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'TokenNotProvided', code: HttpCodes['BAD_REQUEST'], data: {} });
            }
            const userData: IUser = await user.findOne({ emailToken: token })
            if (userData) {
                const currentTime = await getEpoch()
                if (Number(currentTime) <= Number(userData.emailTokenExpiredAt)) {
                    const newPassword = req?.body?.password
                    const salt = randomBytes(32).toString('hex');
                    const hashedPassword = scryptSync(newPassword, salt, 64);
                    const newHashedPassword = `${salt}:${hashedPassword.toString('hex')}`;

                    const updateData = {
                        password: newHashedPassword,
                        emailToken: null,
                        emailTokenExpiredAt: null
                    }
                    var userUpdate: any = await user.updateOne({ _id: userData._id }, updateData, { new: true })
                    if (userUpdate['acknowledged']) {
                        return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'ResetPassword', code: HttpCodes['OK'], data: {} });
                    } else {
                        return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['NOT_FOUND'], data: {} });
                    }
                } else {
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'TokenExpired', code: HttpCodes['UNAUTHORIZED'], data: {} });
                }
            } else {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'TokenExpired', code: HttpCodes['BAD_REQUEST'], data: {} });
            }
        } catch (error) {
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }

    async refreshToken(req: any, callback: any) {
        try {

            let refreshToken = {
                status: false,
                token: ""
            }
            const token = req.body.token
            const trimToken = token.trim()
            const decryptApisecretkey = decrypt(process.env.jwtSecret)
            jwt.verify(trimToken, decryptApisecretkey, async (err, decoded) => {

                if (err) {
                    var decodedToken = jwt.decode(trimToken, { complete: true });
                    if (!decodedToken) {
                        return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', 'code': HttpCodes['UNAUTHORIZED'], 'data': {} });
                    }

                    let tokenData = { _id: decodedToken['payload']['_id'], email: decodedToken['payload']['email'], userName: decodedToken?.['payload']['userName'], role: decodedToken['payload']['role'] };
                    const newtoken = await CreateJwt(tokenData);
                    if (newtoken) {
                        refreshToken = {
                            status: true,
                            token: newtoken
                        }
                        var tokenPayload = {
                            authToken: newtoken
                        }

                        var updaeUser = await user.updateOne({ _id: decodedToken['payload']['_id'] }, tokenPayload, { new: true })
                        var encryptedData = await encryptionData(req.body.type, refreshToken)
                    }
                    return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'notValid', 'code': HttpCodes['OK'], 'data': encryptedData });
                } else {
                    var encryptedData = await encryptionData(req.body.type, refreshToken)
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'ValidToken', 'code': HttpCodes['NOT_MODIFIED'], 'data': encryptedData });
                }
            });
        } catch (error) {
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', 'code': HttpCodes['BAD_REQUEST'], 'data': {} });
        }
    }

    
}