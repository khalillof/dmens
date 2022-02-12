"use strict";
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

var compression = require('compression')
const express = require("express");
var path = require('path');
const winston  = require('winston');
const expressWinston =  require('express-winston');
const  helmet = require('helmet');
const  {dbInit} = require('./common/services/mongoose.service');
const {initializeRoutes}  = require('./routes/init.routes.config');


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

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ], 
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));

// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

exports.app = app;