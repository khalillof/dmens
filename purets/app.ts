require('dotenv').config()
declare function require(name: string): any;
var compression = require('compression');
import express from 'express';
//import * as http from 'http';
// import createError from 'http-errors';
var path = require('path');
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import helmet from 'helmet';
import {config} from './bin/config';
import { dbInit } from './common/services/mongoose.service';
import { initializeRoutes } from './routes/init.routes.config';
import passport from 'passport';
///////////////////////////////////////////
const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

// compress all responses
app.use(compression())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('express-session')({ secret: config.secretKey, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ], 
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));

// static urls
function staticUrl(url: Array<string>) {
  return url.map((e) => path.join(__dirname, e)).forEach((url: string) => app.use(express.static(url)))
}
staticUrl(['../public/coming_soon', '../public/angular', '../public/reactjs']);


// connect to db and initialise db models then
(async (_app:express.Application)=> {

 await dbInit().then( async ()=> { 

 await initializeRoutes(_app)

}).catch((err)=>console.error(err));
//end

})(app);

export default app;