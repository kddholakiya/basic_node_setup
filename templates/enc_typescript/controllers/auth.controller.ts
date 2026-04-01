"use strict";
import authService from "../services/auth.service";
import commonHelper from "../helpers/common";
const { commonResponse } = new commonHelper();

export default class authController {
  authService: authService;
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

  login(req : Request, res : Response) {
    this.authService.login(req.body, async (error : any, result : any) => {
      await commonResponse(res, error, result);
    })
  }

  changePassword(req : Request, res : Response) {
    this.authService.changePassword(req, async (error : any, result : any) => {
      await commonResponse(res, error, result);
    })
  }

  editProfile(req : Request, res : Response) {
    this.authService.editProfile(req, async (error : any, result : any) => {
      await commonResponse(res, error, result);
    })
  }

  logout(req : Request, res : Response) {
    this.authService.logout(req, async (error : any, result : any) => {
      await commonResponse(res, error, result);
    })
  }

  forgetPassword(req : Request, res : Response) {
    this.authService.forgetPassword(req, async (error : any, result : any) => {
      await commonResponse(res, error, result);
    })
  }



  resetPassword(req : Request, res : Response) {
    this.authService.resetPassword(req, async (error : any, result : any) => {
      await commonResponse(res, error, result);
    })
  }


  refreshToken(req : Request, res : Response) {
    this.authService.refreshToken(req, async (error : any, result : any) => {
      await commonResponse(res, error, result);
    })
  }
}
