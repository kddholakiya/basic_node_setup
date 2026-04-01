"use strict";
import authService from "../services/auth.service.js";
import commonHelper from "../helpers/common.js";
const { commonResponse } = new commonHelper();

export default class authController {
  authService;
  constructor() {
    this.authService = new authService();
    this.login = this.login.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.logout = this.logout.bind(this);
    this.forgetPassword = this.forgetPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.refreshToken = this.refreshToken.bind(this);  
  }

  login(req, res) {
    this.authService.login(req.body, async (error, result) => {
      await commonResponse(res, error, result);
    })
  }

  changePassword(req, res) {
    this.authService.changePassword(req, async (error, result) => {
      await commonResponse(res, error, result);
    })
  }

  editProfile(req, res) {
    this.authService.editProfile(req, async (error, result) => {
      await commonResponse(res, error, result);
    })
  }

  logout(req, res) {
    this.authService.logout(req, async (error, result) => {
      await commonResponse(res, error, result);
    })
  }

  forgetPassword(req, res) {
    this.authService.forgetPassword(req, async (error, result) => {
      await commonResponse(res, error, result);
    })
  }



resetPassword(req, res) {
    this.authService.resetPassword(req, async (error, result) => {
      await commonResponse(res, error, result);
    })
  }


  refreshToken(req, res) {
    this.authService.refreshToken(req, async (error, result) => {
      await commonResponse(res, error, result);
    })
  }
}
