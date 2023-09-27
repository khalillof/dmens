import passport, { use } from 'passport';
import express from 'express'
import jwt from 'jsonwebtoken';
import { envConfig, dbStore, logger } from "../../common/index.js";
import { randomUUID } from 'crypto';
//import { nanoid } from 'nanoid/async';
import { responce } from '../../common/index.js';

const { verify, sign, TokenExpiredError } = jwt;

function getExpiredAt(refersh?: boolean) {
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + (refersh ? envConfig.jwtRefreshExpiration() : envConfig.jwtExpiration()));
  return expiredAt;
}

const extractors = {
  fromHeader: function (header_name: string) {
    return function (request: express.Request) {
      var token = null;
      if (request.headers[header_name]) {
        token = request.headers[header_name];
      }
      return token;
    };
  },
  fromBodyField: function (field_name: string) {
    return function (request: express.Request) {
      var token = null;
      if (request.body && Object.prototype.hasOwnProperty.call(request.body, field_name)) {
        token = request.body[field_name];
      }
      return token;
    };
  }
};

function generateJwt(user: any) {
  try {
    //console.log('jwtExpiration: '+config.jwtExpiration())
    const body = { _id: user._id, email: user.email };
    const accessTokenExpireAt = getExpiredAt().getTime();
    const ops = { expiresIn: envConfig.jwtExpiration(), issuer: envConfig.issuer(), audience: envConfig.audience() };

    const accessToken = sign({ user: body }, envConfig.secretKey(), ops);
    return { accessToken, accessTokenExpireAt };
  } catch (err) {
    throw err;
  }
}

//type = 'local' || 'jwt'|| 'facebook' || 'facebook-token'
function authenticateUser(type: string, opts?: {}) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    let loginOptions = { session: false };
    let pssportOptions = type === "jwt" ? loginOptions : {};
    if ('facebook facebook-token'.indexOf(type) !== -1)
      pssportOptions = { failureRedirect: '/auth/login', failureMessage: true }
    try {
      return await passport.authenticate(type, opts ?? pssportOptions, async (err:any, user:any, info:any) => {
          console.log('authenticated user id :')
          console.log((user && user._id) || info || err )

        if (user) {
          let _roles = [];
          for(let id of user.roles){
          let r = await dbStore['role'].findById(id)
          _roles.push(r)
         }
         user['hash']= null;
         user['salt']=null;
         user.roles =_roles;

          // handle local login
          return type === 'local' ? await reqLogin(user, loginOptions, true)(req, res, next) : await reqLogin(user, loginOptions)(req, res, next)

        } else{

          // 
          if (info instanceof TokenExpiredError) {

            let _refToken = req.headers['refreshtoken'];
            if (!_refToken) {
              console.log(req.headers)
              responce(res).badRequest('No refersh token! provided');

              return;
            }

            // refresh token found in header
            let refUser = await dbStore['account'].findOne({ refreshToken: _refToken });

            if (!refUser) {
              responce(res).badRequest('refresh token provided not found');
              return;
            }

            // user found check refresh token is valid
            if (isExpiredToken(refUser.refreshToken_expireAt)) {
              responce(res).unAuthorized('expired refersh token! require sign in');
             return ;
            }

            // valid refresh token was found next generate new access token only and let them access next()
            return await reqLogin(refUser, loginOptions)(req, res, next)
          }
 
          if(info){
            responce(res).badRequest((info.message ?? info ))
          }else{
            responce(res).unAuthorized();
          }
          
          logger.err(err ?? info);

          return;
        }
      })(req, res, next); // end of passport authenticate

    } catch (err:any) {
      logger.resErr(res, (err.message ?? err))
    }
  }

}

async function Tokens(user: any, access = true, refresh = false) {
  // generate json token
  let token = generateJwt(user);
  // update user with new refresh token
   await createRefershToken(user);
  return  token
}
function reqLogin(user: any, options = { session: false }, both_tokens_required = false) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return req.login(user, options, async (err: any) => {
      if (err) {
        responce(res).badRequest(err.message)
        logger.err(err);
        return;
      } else if (both_tokens_required) {

        // generate json token, usually when then first sign in to get both access and refresh tokens
        let _tokens = await Tokens(user, true, true)
        return res.json({ success: true, user:user , tokens:_tokens });

      } else {
        // issue accessToken base on valid refresh token and grant them access to resource next()
        let access = generateJwt(user);

        res.setHeader('Authorization', 'Bearer ' + access.accessToken);
        res.setHeader('accessTokenExpireAt', access.accessTokenExpireAt)

        return next()
      }
    });
  }
}

// no need for this function just use authenticateUser('jwt)
function validateJWT(req: any, res: express.Response, next: express.NextFunction) {
  verify(req.token, envConfig.jwtSecret(), function (err: any, decoded: any) {
    if (err) {
      /*
        err = {
          name: 'TokenExpiredError',
          message: 'jwt expired',
          expiredAt: 1408621000
        }
      */
      logger.resErr(res, err)
    }
    // next function token is valid
    next()
  });
}


async function createRefershToken(user: any) {
  if (!user) {
    throw new Error('user object is required');
  }
    let expireAt = getExpiredAt(true);

    let _token = randomUUID();

    await dbStore['account'].putById(user._id, {
      refreshToken: _token,
      refreshTokenExpireAt: expireAt,
    });
   user.refreshTokenb=_token,
   user.refreshToken_expireAt = expireAt,
    console.log('created Refersh Token : \n' + user.refreshToken)
    /*
    return {
      refreshToken: _token,
      refreshToken_expireAt: expireAt.getTime()
    };
    */
}


function isExpiredToken(expiryat: Date) {
  return expiryat.getTime() < new Date().getTime();
}


export { generateJwt, authenticateUser, validateJWT, verify, createRefershToken, isExpiredToken, randomUUID };