import express from 'express';
import { envs, responces , IMiddlewares} from '../../common/index.js';
import { uploadSchema } from '../../routes/index.js';
import fs from 'fs';
import passport from 'passport';


function isAuthenticated(req: any, res: express.Response, next: express.NextFunction) {
  req.user ? next() : responces.unAuthorized(res);
}

function isInRole(roleName: string) {
  return async (req: any, res: express.Response, next: express.NextFunction) => {
    let user =req.user;
    if (!user) {
      responces.forbidden(res);
      return;
    }

    let role: any = user?.role || user?.profile?.roles || user?.roles;

    if (role && role.indexOf(roleName) !== -1) {
      next()
      return;
    } else {
      responces.forbidden(res)
      return;
    }
  }
}

const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => isInRole(envs.admin_role())(req, res, next);

function isJson(req: express.Request, res: express.Response, next: express.NextFunction) {

  const toJsonNext = (data: any) => {
    req.body = JSON.parse(data);
    next()
  }

  if (req.body && req.header('content-type') === 'application/json') {
    // toJsonNext(req.body);
    next();
  } else if (req.file && req.file.mimetype === 'application/json') {

    fs.readFile(req.file.path, 'utf8', (err: any, data: any) => {
      if (err) {
        responces.error(res,err);
      } else {
        toJsonNext(data);
      }
    });
  } else {

    responces.badRequest(res);
  }
}

async function authorize(req:any, res:any, next:any) {
  return passport.authenticate('jwt', function(err:any, user:any, info:any, status:any) {
    //console.log(`error ==> ${err}\n, user ==> ${user}\n, info : ==> ${info} \n, status : ${status}`);
    if(user){
      req.user = user;
     console.info('user id jwt ......', user)
     // all clear
     return next();
    }else if (err || info) { return responces.error(res,(err ?? info))}
     else { return responces.error(res,new Error('unknown error'),400) }
     
   })(req, res, next);
 };
//export default new Middlewares();
export const Middlewares: IMiddlewares = {
 authorize, uploadSchema, isAuthenticated, isAdmin, isInRole, isJson
}

