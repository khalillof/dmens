"use strict";
import { env } from 'process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const envFileName = env['NODE_ENV'] === 'production' ? '.env' : 'test.env';
export const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), envFileName);
if (!fs.existsSync(envPath)) {
    throw new Error('enviroment file not  found :' + env['NODE_ENV']);
}
// load envirmoment vars
dotenv.config({ path: envPath });
import compression from 'compression';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import { envs, Svc } from './common/index.js';
import { dbInit, ClientSeedDatabase } from './services/index.js';
import { corsWithOptions } from './routes/index.js';
import { menServer } from './bin/www.js';
// Create the Express application
export const app = express();
export const appRouter = express.Router();
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
// compress all responses
app.use(compression());
// view engine setup
//app.set('views', path.join(config.baseDir, 'views'));
//app.set('view engine', 'ejs');
const isDevelopment = envs.isDevelopment();
// static urls
const urls = envs.static_urls();
urls && urls.length && urls.forEach((url) => app.use(express.static(path.join(envs.baseDir, url))));
// request looger using a predefined format string
app.use(morgan(isDevelopment ? 'dev' : 'combined')); // dev|common|combined|short|tiny
// create database models
await dbInit();
app.use(session({
    secret: envs.secretKey(),
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 30,
        secure: true,
        httpOnly: true,
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// cors activation
app.use(corsWithOptions);
//enable CORS (for testing only -remove in production/deployment)
//app.use((req, res, next) => {
//  res.header('Access-Control-Allow-Origin', '*');
//  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
//  next();
//});
// app routes
app.use('/api', appRouter);
// handel 404 shoud be at the midlleware
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Not Found" });
});
// server error handller will print stacktrace
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({ success: false, error: isDevelopment ? err.message : "Ops! server error" });
    console.error(err.stack);
});
// print routes
Svc.routes.print();
// seed database
await new ClientSeedDatabase().init(isDevelopment);
!isDevelopment ? await menServer(app, false) : app.listen(envs.port(), () => envs.logLine(`development server is running on port: ${envs.port()}`));
// remove .env file if exist
if (!isDevelopment && fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
    console.log('.env file will be removed');
}
