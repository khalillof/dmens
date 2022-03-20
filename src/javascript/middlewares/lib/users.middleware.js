"use strict";
const { AuthService } = require('../../services');
const {dbStore} = require('../../common');

class UsersMiddleware {

    constructor() {
        this.db = dbStore['account'];
        this.auth = AuthService;
    }

    static async createInstance() {
        return await Promise.resolve(new UsersMiddleware())
    }

  async  getUserFromReq(req) {
    return req.body && req.body.email ? await this.db.getOneByQuery({email:req.body.email}) : null;
    }

  async  validateRequiredUserBodyFields(req, res, next) {
        if (req.body.email || req.body.username && req.body.password) {
            next();
        } else {
            res.json({success:false, error:'Missing required body fields'})
        }
    }


  async  validateSameEmailDoesntExist(req, res, next) {
    await  this.getUserFromReq(req) ? res.status(400).json({ success:false, error: `User email already exists` }) : next();
    }

   async validateSameEmailBelongToSameUser(req, res, next) {
        const user = await this.getUserFromReq(req)
            user && user._id === req.params.id ? next() : res.status(400).json({ error: `Invalid email` });
    }

    // Here we need to use an arrow function to bind `this` correctly
   async validatePatchEmail(req, res, next) {
        req.body && req.body.email ? await this.validateSameEmailBelongToSameUser(req, res, next) : next();
    }

   async validateUserExists(req, res, next) {
        await  this.getUserFromReq(req) ? next() : res.status(404).json({ error: 'User does not exist : ' +req.body.email });
    }

    verifyUserIsAdmin(req, res, next) {
        req.user && req.user.admin && req.isAuthenticated ? next() : res.status(400).json({success:false,error:'you are not authorized'})

    }
    userIsAuthenticated(req, res, next){
        req.user && req.isAuthenticated ? next() : res.status(400).json({success:false,error:'you are not authorized'})
    }

    extractUserId(req, res, next) {
        req.body.id = req.params.id;
        next();
    }
}

module.exports = {UsersMiddleware};