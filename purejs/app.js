"use strict";
//require('dotenv').config()
Object.defineProperty(exports, "__esModule", { value: true });

require('dotenv').config()

const express = require("express");
//import * as http from 'http';
const http_errors = require("http-errors");
var path = require('path');
const winston  = require('winston');
const expressWinston =  require('express-winston');
const  helmet = require('helmet');
const  {dbInit} = require('./common/services/mongoose.service');
const{ request} = require( 'http');
const {initializeRoutes}  = require('./routes/init.routes.config');
const passport = require('passport');


///////////////////////////////////////////
const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(passport.initialize());

// connect to db and initialise db models then
(async (app)=>{

await dbInit().then( async()=>{

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


await initializeRoutes(app)
 
function staticUrl(url) {
  return url.map((e) => path.join(__dirname, e)).forEach((url) => app.use(express.static(url)))
}
staticUrl(['../public/coming_soon', '../public/angular', '../public/reactjs']);

});
})(app);

// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//  next(http_errors[404]);
//});


/*
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
//end


exports.app = app;