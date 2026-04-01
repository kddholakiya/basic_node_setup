import { body } from 'express-validator';


module.exports.addUser = [
  body('name').trim().exists({ checkFalsy: true }).withMessage("FirstNameRequired"),
  body('name').trim().isLength({ min: 3, max: 30 }).withMessage('NameLength'),
  body('phoneNumber').trim().exists({ checkFalsy: true }).withMessage("PhoneNumberRequired"),
  body('zipCode').trim().exists({ checkFalsy: true }).withMessage("ZipcodeRequired"),
];

module.exports.changePassword = [
  body('password').trim().exists({ checkFalsy: true }).withMessage("PasswordRequired"),
  body('newPassword').trim().isLength({ min: 8 }).withMessage("PasswordValid"),
  body('newPassword').trim().matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").withMessage("PasswordValid")
];

