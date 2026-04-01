"use strict";
import adminService from "../services/admin.service";
import commonHelper from "../helpers/common";
const { commonResponse } = new commonHelper();
import { Request, Response } from 'express';

export default class admiinController {

    adminService : adminService
    constructor () {
        this.adminService = new adminService();
        this.addUser = this.addUser.bind(this);
      }


  addUser(req: Request, res: Response) {
    this.adminService.addUser(req, async (error : any, result : any) => {
      await commonResponse(res, error, result);
    })
  }

}

