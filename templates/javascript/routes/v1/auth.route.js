import { changePassword as validateChangePassword } from '../../helpers/validations/user/user.validate.js';
import { Router } from 'express';
import authController from "../../controllers/auth.controller.js";
import CommanController from "../../helpers/common.js";

const router = Router();
const { login, changePassword, editProfile, logout, forgetPassword, resetPassword, refreshToken } = new authController();
const { CheckValidationError,  VerifyJwt } = new CommanController();

router.post('/login',  login);
router.put('/changepassword', VerifyJwt,  validateChangePassword, CheckValidationError, changePassword);
router.put('/editprofile', VerifyJwt,  editProfile);
router.post('/logout', VerifyJwt,  logout);
router.post('/forgetpassword',  forgetPassword);
router.put('/reset-password',  resetPassword);
router.post('/refreshtoken',  refreshToken);

export default router; // ✅ ESM export