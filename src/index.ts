"use strict";
import { appData, envs } from './common';
import path from 'path';
import compression from 'compression';
import express, { Router } from 'express';
import session from 'express-session';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import { PassportStrategies } from './models';
import { dbInit, ClientSeedDatabase, } from './services';
import { corsWithOptions} from './routes';
import { httpServer } from './bin/www.js';

// Create the Express application
export const app = express();

export const appRouter = express.Router({ mergeParams: true, strict: true });

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
// compress all responses
app.use(compression());

(async () => {

  // static urls
  let staticUrl = envs.static_url();

  if (staticUrl) {
    let staticBaseUrl = path.join(__dirname, staticUrl)
    app.use(express.static(staticBaseUrl))
    // handel spa fallback
    app.get(' ', (req, res, next) => res.sendFile(path.join(staticBaseUrl, '/index.html')));

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

  // strategy jwt
  passport.use(await PassportStrategies.getAuthStrategy());
  //==============================

  // create database models
  await dbInit();

  // seed database
  await new ClientSeedDatabase().init();

})()
  .then(async () => {
    // handel // routes
    // cors activation
    app.use(corsWithOptions);

    //enable CORS (for testing only -remove in production/deployment)
    //app.use((req, res, next) => {
    //  res.header('Access-Control-Allow-Origin', '*');
    //  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    //  next();
    //});

    // app routes
    //app.use('/api',appRouter);


    for await (let { router } of appData.values()) {
      app.use('/api', router);
    }

    // handel 404 shoud be at the midlleware
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(404).json({ success: false, message: "Not Found" })
    })

    // server error handller will print stacktrace
    app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      res.status(err.status || 500).json({ success: false, error: envs.isDevelopment ? err.message : "Ops! server error" });
      console.error(err.stack)
    });

  })
  .then(async () => {
    // run server
    if (!envs.isDevelopment) {
      httpServer(app)
    } else {
      app.listen(envs.port(), () => envs.logLine(`development server is running on port: ${envs.port()}`));
    }
  })
  .then(async() => {
    // run test print infos
    //let _mData = await appData.get('config')?.controller.db.getMetaData();
    //envs.logLine(_mData);

    // print routes
 
    for await (let [name, router] of appData){
           router.routeManager.print(name)
    }
  })
  .then(() => console.log('success >>>>>>>>>>>>>>>>>'))
   .then(() => {
  //let rrr =  appData.get('config');
  //rrr?.routeManager.deleteRoutePath('/posts/extra/viewdata','get')
 // rrr?.routeManager.deleteAllRoutes();
 //console.log(rrr?.routeManager.getRoutesPathMethods('/configs'))
  })
  .catch(err => {
     console.error(err);
     process.exit(1);
    
    })
