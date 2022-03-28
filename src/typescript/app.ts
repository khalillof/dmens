"use strict";
  // Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
  require('dotenv').config();


var compression = require('compression');
import  express from 'express';
const session = require('express-session');
//import * as http from 'http';
// import createError from 'http-errors';
var path = require('path');
import morgan from 'morgan';
import helmet from 'helmet';
import {dbInit} from './services';
import {config, printRoutesToString} from './common'
import { initRouteStore, } from './routes';
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

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

initRouteStore.forEach(async(rout)=> await rout(app))

  }, 500)
  
  setTimeout(()=> {
    printRoutesToString(app);
 // handel 404 shoud be at the midlleware
 app.use((req:express.Request, res:express.Response, next:express.NextFunction) => {
  res.status(404).json( { success:false, message:"Sorry can't find that!"})
})

  }
    ,1000);
  
 
  const dev_prod = app.get('env');
  
  // server error handller will print stacktrace
  app.use(function(err:any, req:express.Request, res:express.Response, next:express.NextFunction) {
    res.status(err.status || 500).json({success:false, error: dev_prod === 'development' ? err.message:"Ops! server error" });
    console.error(err.stack)
  });
  
  // request looger using a predefined format string
  app.use(morgan(dev_prod === 'development'? 'dev': 'common')) // dev|common|combined|short|tiny

 
app.listen(config.port, ()=> console.log(`${dev_prod} server is running on port: ${config.port}`));



export {app};