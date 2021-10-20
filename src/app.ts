declare function require(name: string): any;
import express from 'express';
//import * as http from 'http';
import createError from 'http-errors';
var path = require('path');
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import helmet from 'helmet';
import { dbInit } from './common/services/mongoose.service';
import { initializeRoutes } from './routes/init.routes.config';
import passport from 'passport';
///////////////////////////////////////////
const app: express.Application = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(passport.initialize());

// connect to db and initialise db models then
(async (_app:express.Application)=> {
  await dbInit().then(()=>{



_app.use(helmet({
  contentSecurityPolicy: false
}));

_app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));

initializeRoutes(_app)

function staticUrl(url: Array<string>) {
  return url.map((e) => path.join(__dirname, e)).forEach((url: string) => _app.use(express.static(url)))
}
staticUrl(['../public/coming_soon', '../public/angular', '../public/reactjs']);


// catch 404 and forward to error handler
_app.use(function (req, res, next) {
  next(createError[404]);
});

// error handler
_app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//end
}).catch((err)=> console.error(err));
})(app);

export default app;