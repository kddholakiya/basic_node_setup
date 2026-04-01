import { addUser as validateAddUser } from '../../helpers/validations/user/user.validate.js';
import { Router } from 'express';
import adminController from "../../controllers/admin.controller.js";
import CommanController from "../../helpers/common.js";

const router = Router();
const { addUser } = new adminController();
const { CheckValidationError,  VerifyJwt } = new CommanController();

router.post('/createuser', VerifyJwt,  validateAddUser, CheckValidationError, addUser);

export default router;