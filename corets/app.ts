require('dotenv').config()
declare function require(name: string): any;
var compression = require('compression');
import  express from 'express';
const session = require('express-session');
//import * as http from 'http';
// import createError from 'http-errors';
var path = require('path');
import morgan from 'morgan';


import helmet from 'helmet';
import {config} from './bin/config';
import {dbInit} from './common/services/mongoose.service';
import {appRouter} from './common/customTypes/types.config'
import { initCustomRoutes } from './routes';
import passport from 'passport';


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
   
  });
  })(app);

app.use(helmet({
  contentSecurityPolicy: false
}));

setTimeout(async()=>{
  // register routes
  app.use('/', appRouter);
  
  // print routes
 await initCustomRoutes()
  }, 500)

  if (app.get('env') === 'development') {
    console.log('development server')
    // request handellar ==================================
   // using a predefined format string
  app.use(morgan('dev')) // dev|common|combined|short|tiny

     // development error handler ===============================
  // will print stacktrace
    app.use(function(err:any, req:any, res:any, next:any) {
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
  app.use(function(err:any, req:any, res:any, next:any) {
    res.status(err.status || 500);
    console.error(err.stack)
    res.json({ error: 'Something broke!' });
  });
  }

export default app;