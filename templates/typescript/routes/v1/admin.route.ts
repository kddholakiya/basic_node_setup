import * as validateUser from '../../helpers/validations/user/user.validate';
const router = require('express').Router();
import adminController from "../../controllers/admin.controlller";
const {addUser , } = new adminController();

import CommanController from "../../helpers/common";
const {  CheckValidationError  , VerifyJwt } = new CommanController();
module.exports = (function() {

    router.post('/createuser',VerifyJwt,validateUser['addUser'] , CheckValidationError, addUser);

        
    return router;
})();