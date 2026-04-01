import * as validateUser from '../../helpers/validations/user/user.validate';
const router = require('express').Router();

 import authController from "../../controllers/auth.controller";
const { login,changePassword,editProfile,logout,forgetPassword, resetPassword, refreshToken, } = new authController();

 import CommanController from "../../helpers/common";
const { CheckValidationError, DecryptPayload, VerifyJwt } = new CommanController();
module.exports = (function() {
 
 router.post('/login',DecryptPayload , login);
 router.put('/changepassword' , VerifyJwt ,DecryptPayload, validateUser['changePassword'] , CheckValidationError , changePassword);
 router.put('/editprofile',VerifyJwt,DecryptPayload,editProfile);
 router.post('/logout',VerifyJwt,DecryptPayload, logout);
 router.post('/forgetpassword' , DecryptPayload,forgetPassword);
 router.put('/reset-password' , DecryptPayload  , resetPassword)
 router.post('/refreshtoken' , DecryptPayload ,  refreshToken)
 return router;
})();