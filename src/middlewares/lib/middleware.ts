import express from 'express';
import { Svc, responce} from '../../common/index.js';
import { IMiddlewares } from '../../interfaces/index.js';
import { uploadSchema } from '../../routes/index.js';
import fs from 'fs';
import { authenticateJwt as authenticate } from '../../services/index.js';


  async function getUserFromReq(req: express.Request) {
    return req.body && req.body.email ? await Svc.db.get('account')!.findOne({ email: req.body.email }) : null;
  }
  function checkLoginUserFields(req: express.Request, res: express.Response, next: express.NextFunction):void {
    if (req.body) {
      let { email, username, password } = req.body;
      if (!username && email) { req.body.username = email };
      if (!email && username) { req.body.email = username };

      if (req.body.email && req.body.password) {
        next();
      }else{
        responce(res).badRequest('Missing required body fields')
      }
    }else{
    responce(res).badRequest('Missing required body fields')
    }
  }

  async function validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
    await getUserFromReq(req) ? responce(res).badRequest('User email already exists') : next();
  }

  function validateCurrentUserOwnParamId(req: express.Request, res: express.Response, next: express.NextFunction) {
    let user:any = req.user;
    user && String(user._id) === String(req.params['id']) ? next() : responce(res).unAuthorized();
  }
  function validateBodyEmailBelongToCurrentUser(req: any, res: express.Response, next: express.NextFunction) {
    (req.user && req.body.email === req.user.email) ? next() : responce(res).unAuthorized();
  }

  function validateHasQueryEmailBelongToCurrentUser(req: any, res: express.Response, next: express.NextFunction) {
    (req.user && req.query.email === req.user.email) ? next() : responce(res).forbidden('not authorized, require valid email');
  }

  async function userExist(req: express.Request, res: express.Response, next: express.NextFunction) {
    await getUserFromReq(req) ? next() : responce(res).forbidden('User does not exist : ' + req.body.email);
  }


  function isAuthenticated(req: any, res: express.Response, next: express.NextFunction) {
    req.user ? next() : responce(res).unAuthorized();

  }


  function isInRole(roleName: string) {
    return async (req: any, res: express.Response, next: express.NextFunction) => {
      if (!req.user) {
        responce(res).forbidden('require authentication');
        return;
      }
      else if (req.user.roles) {
        for (let r of req.user.roles) {
          if (r.name === roleName) {
            next();
            return;
          }
        }

      }else{
        responce(res).forbidden(`Require ${roleName} Role!`)
        return;
      }
    }
  }

 const isAdmin = async(req: express.Request, res: express.Response, next: express.NextFunction)=> isInRole('admin')(req,res,next);

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
          responce(res).error(err);
        } else {
          toJsonNext(data);
        }
      });
    } else {

      responce(res).badRequest('content must be valid application/json');
    }
  }
//}
//export default new Middlewares();
const Middlewares:IMiddlewares = {authenticate,getUserFromReq,checkLoginUserFields,validateSameEmailDoesntExist,
  validateCurrentUserOwnParamId,validateBodyEmailBelongToCurrentUser,validateHasQueryEmailBelongToCurrentUser,
  userExist,uploadSchema,isAuthenticated,isAdmin,isInRole,isJson}

export default Middlewares;