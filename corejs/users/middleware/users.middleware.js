"use strict";
const { AuthService } = require('../../auth/services/auth.service');
const { UsersController } = require('../../controllers/');

class UsersMiddleware {

    constructor() {
        this.cont = new UsersController();
    }
    static async createInstance() {
        return await Promise.resolve(new UsersMiddleware())
    }

    verifyUser = AuthService.authenticateUser;
    getUserFromReq(req) {
        return req.body && req.body.email ? this.cont.getOneByQuery({ email: req.body.email }) : null;
    }

    validateRequiredUserBodyFields(req, res, next) {
        if (req.body.email || req.body.username && req.body.password) {
            next();
        } else {
            this.cont.resError(res, 'Missing required body fields')
        }
    }


    validateSameEmailDoesntExist(req, res, next) {
        this.getUserFromReq(req) ? this.cont.sendJson({ success: false, error: `User email already exists` }, 400, res) : next();
    }

    validateSameEmailBelongToSameUser(req, res, next) {
        let user = this.getUserFromReq(req)
        user && user._id === req.params.id ? next() : this.cont.sendJson({ error: `Invalid email` }, 400, res);
    }

    // Here we need to use an arrow function to bind `this` correctly
    validatePatchEmail(req, res, next) {
        req.body && req.body.email ? this.validateSameEmailBelongToSameUser(req, res, next) : next();
    }

    validateUserExists(req, res, next) {
        this.getUserFromReq(req) ? next() : this.cont.sendJson({ error: 'User does not exist : ' + req.body.email }, 404, res);
    }

    verifyUserIsAdmin(req, res, next) {
        req.user && req.user.admin ? next() : this.cont.resError(res, 'you are not authorized')

    }
    extractUserId(req, res, next) {
        req.body.id = req.params.id;
        next();
    }
}

exports.UsersMiddleware = UsersMiddleware;