"use strict";
import { envs} from './common/index.js';
import path from 'path';
import compression from 'compression';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import { Store} from './services/index.js';
import { dbInit, ClientSeedDatabase } from './services/index.js';
import { corsWithOptions } from './routes/index.js';
import { menServer } from './bin/www.js';

export  const app = express();
export const appRouter = express.Router();

const appSettings= async ()=>{
// Create the Express application


app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// compress all responses
app.use(compression())
// view engine setup
//app.set('views', path.join(config.baseDir, 'views'));
//app.set('view engine', 'ejs');


// static urls
let staticUrl = envs.static_url();

if(staticUrl){
  let staticBaseUrl = path.join(__dirname,staticUrl)
 app.use(express.static(staticBaseUrl))
// handel spa fallback

app.get(' ',(req, res, next) => {
  
  res.sendFile(path.join(staticBaseUrl,'/index.html'));
});

}
// request looger using a predefined format string
app.use(morgan(envs.isDevelopment ? 'dev' : 'combined')) // dev|common|combined|short|tiny


app.use(session({
  secret: envs.secretKey(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 30,
    secure: true,
    httpOnly: true,
  }
}));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('-----------------------------');
  console.log('serialize user');
  console.log(user);
  console.log('-----------------------------');
  done(null, user);
});
passport.deserializeUser(function(user:any, done) {
  console.log('-----------------------------');
  console.log('deserialize user');
  console.log(user);
  console.log('-----------------------------');
  done(null, user);
});
// create database models
await dbInit();


// cors activation
app.use(corsWithOptions);

//enable CORS (for testing only -remove in production/deployment)
//app.use((req, res, next) => {
//  res.header('Access-Control-Allow-Origin', '*');
//  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
//  next();
//});

// app routes
app.use('/api',appRouter);

// handel 404 shoud be at the midlleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).json({ success: false, message: "Not Found" })
})

// server error handller will print stacktrace
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(err.status || 500).json({ success: false, error: envs.isDevelopment ? err.message : "Ops! server error" });
  console.error(err.stack)
});

// print routes
Store.route.print();

// seed database
await new ClientSeedDatabase().init();


if(!envs.isDevelopment){
  menServer(app, false) 
  }else{
  app.listen(envs.port(), () => envs.logLine(`development server is running on port: ${envs.port()}`));

  }

}

 
appSettings().then(()=> console.log('success >>>>>>>>>>>>>>>>>')).catch(err=>console.error(err))

//let _forms:any[] = await Promise.all(Svc.db.obj().map(async (d)=>  await d.config.genForm!()));
//envs.logLine(_forms)
 // Svc.routes.deleteAppRoute('/roles')

 //let r = Svc.routes.getRoutesPathMethods('/configs');
 //envs.logLine(r)

