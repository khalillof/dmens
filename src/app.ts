"use strict";
import dotenv from 'dotenv';
import express from 'express';
import compression from 'compression';
import session from 'express-session';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import { config, printRoutesToString } from './common/index.js';
import { dbInit, ClientSeedDatabase } from './services/index.js';
import { initRouteStore, corsWithOptions } from './routes/index.js';
import { menServer } from './bin/www.js';

// connect to db and initialise db models then
const mens = (async (envpath?: string) => {
  if (envpath && !path.isAbsolute(envpath)) {
    throw new Error('enviroment path passed ashould be Absolute path :' + envpath);
  } else if (envpath && !fs.existsSync(envpath!)) {
    throw new Error('enviroment file path provided dose not exist :' + envpath);
  }

  envpath ? dotenv.config({ path: envpath }) : dotenv.config();
  console.log('enviroment path provided : ' + envpath);


  // Create the Express application
  const app = express();
  app.use(express.json({limit: "20mb"}));
  app.use(express.urlencoded({limit: "20mb", extended: true}));
  // compress all responses
  app.use(compression())
  // view engine setup
  //app.set('views', path.join(config.baseDir, 'views'));
  //app.set('view engine', 'ejs');


  // static urls
  config.static_urls().forEach((url: string) => app.use(express.static(path.join(config.baseDir, url))));

  await dbInit();

  setTimeout(async () => {

    app.use(session({
      secret: config.secretKey(),
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 30,
        secure: true,
        httpOnly: true,
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));

    // cors activation
    app.use(corsWithOptions);

    setTimeout(async () => {
      initRouteStore.forEach(async (rout: any) => await rout(app))
    }, 1000)


    setTimeout(async () => {
      printRoutesToString(app);
      // seed database
      // new SeedDatabase();
      await new ClientSeedDatabase().init();

      // handel 404 shoud be at the midlleware
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(404).json({ success: false, message: "Sorry can't find that!" })
      })
    }
      , 1500);


    const dev_prod = app.get('env');

    // server error handller will print stacktrace
    app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      res.status(err.status || 500).json({ success: false, error: dev_prod === 'development' ? err.message : "Ops! server error" });
      console.error(err.stack)
    });

    // request looger using a predefined format string
    app.use(morgan(dev_prod === 'development' ? 'dev' : 'common')) // dev|common|combined|short|tiny
    console.log(' allowed cores are :' + config.allow_origins())
    dev_prod !== 'development' ? await menServer(app, false) : app.listen(config.port(), () => console.log(`${dev_prod} server is running on port: ${config.port()}`));
  }, 3000)
  return app;
});

export { mens };
//console.log('================================================='+config.baseDir)
//mens(path.resolve(config.baseDir, '../.env'));