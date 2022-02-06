"use strict";
require('dotenv').config()
var compression = require('compression')
const express = require("express");
//import * as http from 'http';
//const http_errors = require("http-errors");
var path = require('path');
const winston  = require('winston');
const expressWinston =  require('express-winston');
const  helmet = require('helmet');
const {config} = require('./bin/config');
const  {dbInit} = require('./common/services/mongoose.service');
const {initializeRoutes}  = require('./routes/init.routes.config');
const passport = require('passport');


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
function staticUrl(url) {
  return url.map((e) => path.join(__dirname, e)).forEach((url) => app.use(express.static(url)))
}
staticUrl(['../public/coming_soon', '../public/angular', '../public/reactjs']);


// connect to db and initialise db models then
(async (app)=>{

await dbInit().then( async()=>{

await initializeRoutes(app)

});
})(app);


exports.app = app;