import { changePassword as validateChangePassword } from '../../helpers/validations/user/user.validate.js';
import { Router } from 'express';
import authController from "../../controllers/auth.controller.js";
import CommanController from "../../helpers/common.js";

const router = Router();
const { login, changePassword, editProfile, logout, forgetPassword, resetPassword, refreshToken } = new authController();
const { CheckValidationError, DecryptPayload, VerifyJwt } = new CommanController();

router.post('/login', DecryptPayload, login);
router.put('/changepassword', VerifyJwt, DecryptPayload, validateChangePassword, CheckValidationError, changePassword);
router.put('/editprofile', VerifyJwt, DecryptPayload, editProfile);
router.post('/logout', VerifyJwt, DecryptPayload, logout);
router.post('/forgetpassword', DecryptPayload, forgetPassword);
router.put('/reset-password', DecryptPayload, resetPassword);
router.post('/refreshtoken', DecryptPayload, refreshToken);

export default router; // ✅ ESM export