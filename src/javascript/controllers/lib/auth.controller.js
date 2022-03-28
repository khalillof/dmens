"use strict";
const { DefaultController } = require('./default.controller');
const { dbStore} =require('../../common');
const { verifyTokenExpiration,generateGwt } =require('../../services');

class AuthController extends DefaultController {

    constructor(svc) {
        super(svc)
    }
    // find check refeshToken and create accessToken
 async createAccessTokenBaseOnRefershToken(req, res, next){

    const requestRefreshToken  = req.query.token;
    if (requestRefreshToken == null) {
      return this.responce(res).errStatus(403,"Refresh Token is required!" );
    }
   
      let refreshToken = await dbStore['token'].model.findOne({ token: requestRefreshToken });
      if (!refreshToken) {
        this.responce(res).errStatus(403, "Refresh token is not found!" );
        return;
      }
      if (verifyTokenExpiration(refreshToken)) {
        dbStore['token'].model.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
        
        this.responce(res).errStatus(403,"Refresh token was expired. Please make a new signin request");
        return;
      }
      let newAccessToken = generateGwt(refreshToken.owner);
      return res.status(200).json({
        success:true,
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    
  };

}

exports.AuthController=  AuthController;
