"use strict";
import adminService from "../services/admin.service.js";
import commonHelper from "../helpers/common.js";
const { commonResponse } = new commonHelper();

export default class admiinController {

    adminService 
    constructor () {
        this.adminService = new adminService();
        this.addUser = this.addUser.bind(this);
      }


  addUser(req, res) {
    this.adminService.addUser(req, async (error, result) => {
      await commonResponse(res, error, result);
    })
  }

}

