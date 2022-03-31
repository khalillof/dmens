"use strict";

const passport = require('passport');
const { sign, verify} = require('jsonwebtoken'); // used to create, sign, and verify tokens
const { config, dbStore, logger } = require("../../common");
const {randomBytes} = require('crypto');
const { nanoid } = require('nanoid/async');

// 16 | 48
async function getRandomBytes(length=16){
  let key = randomBytes(length).toString('hex'); 
  return key;
}


function generateGwt(user) {
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
function authenticateUser(type, opts) {
  return async (req, res, next) => {
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

function reqLogin(user, options = { session: false }, tokenRequired = false) {
  return async (req, res, next) => {
    return req.login(user, options, async (err) => {
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
function validateJWT(req, res, next) {
  verify(req.token, config.jwtSecret(), function (err, decoded) {
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

async function createRefershToken(user) {
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


async function createRefershTokenWithChecks(user) {
  // check database for avaliable token
  let refToken = await dbStore['token'].findOne({ owner: user._id });
  if (!refToken) {
    return await createRefershToken(user);
  }
  else if (!isExpiredToken(refToken)) {
    // update delete old token
    await dbStore['token'].deleteById(refToken._id);
    return await createRefershToken(user);
  } 
};

function isExpiredToken(token) {
  return token.expiryDate.getTime() < new Date().getTime();
}


module.exports = { generateGwt, authenticateUser, validateJWT, createRefershTokenWithChecks, createRefershToken, isExpiredToken, getRandomBytes,verify,  nanoid};