// ✅ All imports at the very top
import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import i18n from "i18n";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createServer } from "http";
import { HttpCodes } from "./helpers/responseCodes.js";
import AuthRoute from "./routes/v1.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const useragent = require('express-useragent');

if (fs.existsSync("./.env")) {
    dotenv.config({quiet: true});
}

const app = express();

// Middleware
app.use(express.json({ type: 'application/json', limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(express.static('public'));

// i18n
i18n.configure({
    locales: ["en"],
    directory: resolve(__dirname, "./locales"),
    defaultLocale: "en",
    queryParameter: "lang",
    objectNotation: true
});
app.use(i18n.init);

// CORS
app.use(cors());

// Rate limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 70,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(200).json({ status: false, message: "Reached to max request limit", code: 429, data: {} });
    }
});
app.use(limiter);

// View engine
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.send("Welcome to Backend");
});
app.use("/api/v1", AuthRoute);

app.use((err, req, res, next) => {
    if ((err instanceof SyntaxError && 'body' in err) || err?.status == 413) {
        return res.status(200).json({ status: false, message: res.__("api.errors.SomethingWrong"), code: HttpCodes['BAD_REQUEST'], data: {} });
    }
    next();
});

const httpServer = createServer(app);
export { app, httpServer };