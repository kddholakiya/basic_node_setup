"use strict";

import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import cors from 'cors';
import path, { join, resolve } from "path";
import morgan from 'morgan';
import i18n from "i18n";
import helmet from "helmet";
const app = express();
import { rateLimit } from 'express-rate-limit'


var useragent = require('express-useragent');
app.use(useragent.express());

app.use(express.static('public'));
// Load envs from .env file
if (fs.existsSync("./.env")) {
  require("dotenv").config();
}

// Localization setup
i18n.configure({
  locales: ["en"],
  directory: resolve(__dirname, "../locales"),
  defaultLocale: "en",
  queryParameter: "lang",
  objectNotation: true
});

app.use(i18n.init);
app.use(helmet())
app.use(cors());
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 70,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => { res.status(200).json({ status: false, message: "Reached to max request limit", code: 429, data: {} }) }
})
app.use(limiter);

// View engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "pug");
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ type: 'application/json', limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((err: any, req:Request, res : Response, next : NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err || err?.status == 413) {
    return res.status(200).json({ status: false, message: res.__("api.errors.SomethingWrong"), code: HttpCodes['BAD_REQUEST'], data: {} });
  }
  next();
});

app.get('/', function (req, res) {
  res.send("Welcome to Backend");
});



let allowCrossDomain = function (req: Request, res: Response, next: NextFunction) {



  if ("OPTIONS" === req.method) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,PATCH,HEAD, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token"
    );

    res.send(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);

// Load routes
let AuthRoute = require("./routes/v1");

app.use("/api/v1", AuthRoute);

import { createServer } from "http";
import { Server } from "socket.io";
import rootSocketIo from './helpers/socketIo';
import { HttpCodes } from "./helpers/responseCodes";

const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: '*' }, path: "/socket.io" });
rootSocketIo(io);

module.exports = { app, io, httpServer }

