"use strict";
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

var compression = require('compression')
const express = require("express");
const session = require('express-session');
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


// Create the Express application
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// compress all responses
app.use(compression())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// connect to db and initialise db models then
(async (app)=>{

  await dbInit().then( async()=>{

  app.use(session({ 
    secret: config.secretKey, 
    resave: true, 
    saveUninitialized: true,
    cookie:{
      maxAge: 1000 *30
    }}));    

  app.use(passport.initialize());
  app.use(passport.session());
   
  await initializeRoutes(app)
  
  });
  })(app);



// static urls
function staticUrl(url) {
  return url.map((e) => path.join(__dirname, e)).forEach((url) => app.use(express.static(url)))
}
staticUrl(['../public/coming_soon', '../public/angular', '../public/reactjs']);


app.use(helmet({
  contentSecurityPolicy: false
}));
/*
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ], 
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));
*/


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err.message });
});
exports.app = app;