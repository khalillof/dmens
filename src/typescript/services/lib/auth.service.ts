import passport from 'passport';
import express from 'express'
import { sign , verify} from 'jsonwebtoken'; // used to create, sign, and verify tokens
import { config, dbStore, logger } from "../../common";
const {randomBytes} = require('crypto');
import { nanoid } from 'nanoid/async';

// 16 | 48
async function getRandomBytes(length=16){
  let key = randomBytes(length).toString('hex'); 
  return key;
}


function generateGwt(user:any) {
  try {
    const body = { _id: user._id, email: user.email };
    const ops = { expiresIn: config.jwtExpiration(), issuer: config.issuer(), audience: config.audience() };
    const token = sign({ user: body }, config.secretKey(), ops);
    return token;
  } catch (err) {
    throw err;
  }
}

//type = 'local' || 'jwt'|| 'facebook' || 'facebook-token'
function authenticateUser(type:string, opts?:{}) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let loginOptions = { session: false };
    let pssportOptions = type === "jwt" ? loginOptions : {};
    if ('facebook facebook-token'.indexOf(type) !== -1)
      pssportOptions = { failureRedirect: '/accounts/login', failureMessage: true }
    try {
      return await passport.authenticate(type, opts ?? pssportOptions, async (err, user, info) => {
        
        if (user) {
          // handle local login
          if (type === 'local') {
            return await reqLogin(user, loginOptions, true)(req, res, next)
          } else {
            // all other type like jwt | facebook
            return await reqLogin(user, loginOptions)(req, res, next)
          }

        } else if (err || info) {

          res.json({success:false, error: err ? err.message : info.message})
        logger.err(err ?? info);
        return;
        }
      })(req, res, next); // end of passport authenticate

    } catch (err) {

      logger.resErr(res,err)
    }
  }

}

function reqLogin(user:any, options = { session: false }, tokenRequired = false) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return req.login(user, options, async (err:any) => {
      if (err) {
        res.json({success:false,error:err.message})
        logger.err(err);
        return;
      } else if (tokenRequired) {
        // generate json token
        let token = generateGwt(user);
        let refreshT = await createRefershTokenWithChecks(user);
        return res.json({ success: true, message: "Authentication successful", accessToken: token, refershToken: refreshT });
      } else {
        return next()
      }
    });
  }
}

// no need for this function just use authenticateUser('jwt)
function validateJWT(req: any, res: express.Response, next: express.NextFunction) {
  verify(req.token, config.jwtSecret(), function (err:any, decoded:any) {
    if (err) {
      /*
        err = {
          name: 'TokenExpiredError',
          message: 'jwt expired',
          expiredAt: 1408621000
        }
      */
      logger.resErr(res,err)
    }
    // next function token is valid
    next()
  });
}

function customVerifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  let token = req.headers["x-access-token"];
  if(typeof token !== 'string'){
    token = token![0]
  }
  if (!token) {
    return res.status(403).json({ success: false, message: "No token provided!" });
  }
  verify(token, config.jwtSecret, (err:any, decoded:any) => {
    if (err) {
      return logger.resErr(res,err)
    }
    //req.id = decoded.id;
    next();
  });
};

async function createRefershTokenWithoutChecking(user:any) {
  if (user) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration());

    let _token =  await nanoid();
    
    let _refreshToken = await dbStore['token'].create({
      token: _token,
      owner: user._id,
      expiryDate: expiredAt.getTime(),
    });

    console.log('createRefershTokenWithoutChecking : \n'+_refreshToken)

    return _refreshToken.token;
  }
  throw new Error('passed user object is undefind');
}


async function createRefershTokenWithChecks(user:any) {
  // check database for avaliable token
  let refToken = await dbStore['token'].model?.findOne({ owner: user._id });
  if (!refToken) {
    return await createRefershTokenWithoutChecking(user);
  }
  else if (!verifyTokenExpiration(refToken)) {
    return refToken.token;
  } else {
    // remove expired token
   await dbStore['token'].model?.findByIdAndRemove(refToken._id, { useFindAndModify: false }).exec();
    return await createRefershTokenWithoutChecking(user);
  }
};

function verifyTokenExpiration(token:any) {
  return token.expiryDate.getTime() < new Date().getTime();
}


export { generateGwt, authenticateUser, validateJWT, customVerifyToken, createRefershTokenWithChecks, verifyTokenExpiration, getRandomBytes,  nanoid};