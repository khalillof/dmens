"use strict";
const {isValidRole, dbStore, responce} = require('../../common');


class Middlewares {

    static async createInstance() {
        return await Promise.resolve(new Middlewares())
    }

  async  getUserFromReq(req) {
    return req.body && req.body.email ? await dbStore['account'].findOne({email:req.body.email}) : null;
    }

  async  validateRequiredUserBodyFields(req, res, next) {
        if (req.body.email || req.body.username && req.body.password) {
            next();
        } else {
          responce(res).fail('Missing required body fields')
        }
    }


  async  validateSameEmailDoesntExist(req, res, next) {
    await  this.getUserFromReq(req) ? responce(res).notAuthorized('User email already exists') : next();
    }

   async validateSameEmailBelongToSameUser(req, res, next) {
        const user = await this.getUserFromReq(req);
        user && user._id === req.params.id ? next() :responce(res).notAuthorized('Invalid email');
    }

    // Here we need to use an arrow function to bind `this` correctly
   async validatePatchEmail(req, res, next) {
        req.body && req.body.email ? await this.validateSameEmailBelongToSameUser(req, res, next) : next();
    }

   async userExist(req, res, next) {
        await  this.getUserFromReq(req) ? next() :responce(res).notAuthorized('User does not exist : ' +req.body.email);
    }

    isAuthenticated(req, res, next){
        req.isAuthenticated() ? next() :responce(res).notAuthorized('you are not authorized');
    }

    // roles
    isRolesExist(roles){
      if (roles) {
        for (let i = 0; i < roles.length; i++) {
          if (!isValidRole(roles[i])) {
            return false;
          }
        }
      }
      return true;
  
    };

    
    isInRole(roleName){
      return async (req, res, next)=>{
        if(!req.isAuthenticated()){
          responce(res).notAuthorized('you are not authorized')
        return;
      }

    let user = await  dbStore['account'].findById(req.user._id);

    let roles = await dbStore['role'].model.find({_id: { $in: user.roles }})
              if(roles && roles.length > 0){
              for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === roleName) {
                  next();
                  return;
                }
              }
            }

            responce(res).notAuthorized("Require Admin Role!" );
              return;  
    }
    }
}

module.exports = {Middlewares};

