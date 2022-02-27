"use strict";
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

var compression = require('compression')
const express = require("express");
const session = require('express-session');
//import * as http from 'http';
//const http_errors = require("http-errors");
var path = require('path');
const morgan  = require('morgan');

const  helmet = require('helmet');
const {config} = require('./bin/config');
const  {dbInit} = require('./common/services/mongoose.service');
const {printRoutesToString ,appRouter}  = require('./common/customTypes/types.config');
const  {initRouteStore} = require('./routes');
const passport = require('passport');
const { Promise } = require('mongoose');


// Create the Express application
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// compress all responses
app.use(compression())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// static urls
['../public/coming_soon', '../public/angular', '../public/reactjs'].forEach((url) => app.use(express.static(path.join(__dirname, url))));


// connect to db and initialise db models then
(async (app)=> {
  await dbInit().then(()=>{

    app.use(session({ 
      secret: config.secretKey, 
      resave: true, 
      saveUninitialized: true,
      cookie:{
        maxAge: 1000 *30
      }}));    
  
    app.use(passport.initialize());
    app.use(passport.session());

  //===========================================end
  });

})(app);


app.use(helmet({
  contentSecurityPolicy: false
}));


setTimeout(async()=>{
initRouteStore.forEach(async(rout)=> await rout())

  // register routes
  app.use('/', appRouter);

  }, 500)
  
  setTimeout(printRoutesToString,1000);
 
  if (app.get('env') === 'development') {
    console.log('development server')
    // request handellar ==================================
   // using a predefined format string
  app.use(morgan('dev')) // dev|common|combined|short|tiny

     // development error handler ===============================
  // will print stacktrace
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      console.error(err.stack)
      res.json({ error: err });
    });
  }else{
    console.log('production server')
    // request looger using a predefined format string
   app.use(morgan('common')) // dev|common|combined|short|tiny

      // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack)
    res.json({ error: 'Something broke!' });
  });
  }
  


exports.app = app;
app.listen(config.port, ()=> console.log('server is running on port: '+config.port))