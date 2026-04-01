import * as validateUser from '../../helpers/validations/user/user.validate';
const router = require('express').Router();

 import authController from "../../controllers/auth.controller";
const { login,changePassword,editProfile,logout,forgetPassword, resetPassword, refreshToken, } = new authController();

 import CommanController from "../../helpers/common";
const { CheckValidationError,  VerifyJwt } = new CommanController();
module.exports = (function() {
 
 router.post('/login',login);
 router.put('/changepassword' , VerifyJwt ,validateUser['changePassword'] , CheckValidationError , changePassword);
 router.put('/editprofile',VerifyJwt,editProfile);
 router.post('/logout',VerifyJwt,logout);
 router.post('/forgetpassword',forgetPassword);
 router.put('/reset-password',resetPassword)
 router.post('/refreshtoken',refreshToken)
 return router;
})();