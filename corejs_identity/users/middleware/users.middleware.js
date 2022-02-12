"use strict";
const { AuthService } = require('../../auth/services/auth.service');
const { UsersController } = require('../../controllers/users.controller');

class UsersMiddleware {

    constructor() {
        this.controller = UsersController.createInstance();
    }
    static async createInstance() {
        return await Promise.resolve(new UsersMiddleware())
    }

    verifyUser = AuthService.authenticateUser;

    validateRequiredUserBodyFields(req, res, next){
        if(req.body && req.body.email || req.body.username && req.body.password){
            next();
        }else{
            res.json({success: false, error: 'Missing required body fields'});
        }
    }

    validateSameEmailDoesntExist(self) {
        return (req, res, next) => {
            self.getUserByEmail(req.body.email).then((user) => {
                user ? self.sendJson({ error: `User email already exists` }, 400, res) : next();

            }).catch((err) => {
                console.error(err);
                next(err)
            })
        }
    }

    validateSameEmailBelongToSameUser(self) {
        return (req, res, next) => {
            const user = self.getUserByEmail(req.body.email);
            if (user && user.id === req.params.userId) {
                next();
            } else {
                self.sendJson({ error: `Invalid email` }, 400, res);
            }
        }
    }
    // Here we need to use an arrow function to bind `this` correctly
    validatePatchEmail(self) {
        return (req, res, next) => {
            if (req.body.email) {
                self.validateSameEmailBelongToSameUser(req, res, next);
            } else {
                next();
            }
        }
    }

    validateUserExists(self) {
        return (req, res, next) => {
            self.getUserByEmail(req.body.email).then((user) => {
                user ? next() : self.sendJson({ error: 'User ${req.body.email' }, 404, res);
            }).catch((err) => next(err));
        }
    }

    verifyUserIsAdmin(req, res, next){
            if (req.user && req.user.admin) {
                next()
            } else {
                res.json({success:false, message: 'you are not authorized' });
            }
    }

    extractUserId(req, res, next) {
        req.body.id = req.params.id;
        next();
    }
}

exports.UsersMiddleware = UsersMiddleware;