"use strict";
const { JwtService } = require('../../auth/services/jwt.service');
const { UsersController } = require('../../controllers/users.controller');
const { verify } = require('argon2');

class UsersMiddleware {

    constructor() {
        this.Controller = UsersController.createInstance();
    }
    static async createInstance() {
        return await Promise.resolve(new UsersMiddleware())
    }

    verifyUser = new JwtService().verifyUser;

    validateRequiredUserBodyFields(self) {
        return (req, res, next) => {
            if (req.body && req.body.email && req.body.password) {
                next();
            } else {
                self.sendJson({ error: 'Missing body fields: email, password' }, 400, res);
            }
        }
    }

    verifyUserPassword(self) {
        return (req, res, next) => {

            self.getUserByEmail(req.body.email, self.controller).then(async (user) => {
                if (user) {
                    let passwordHash = user.password;
                    if (await verify(passwordHash, req.body.password)) {
                        req.body.password = passwordHash;
                        req.body._id = user._d;
                        //req.user = user;
                        //req.body = {
                        //    userId: user._id,
                        //    email: user.email,
                        //    provider: 'email',
                        //    password: passwordHash
                        //permissionLevel: user.permissionLevel,
                        //};
                        next();
                    } else {
                        self.sendJson({ error: 'Invalid e-mail and/or password' }, 400, res);
                    }
                } else {
                    self.sendJson({ error: 'Invalid e-mail and/or password' }, 400, res);
                }
            }).catch((err) => next(err));
        }
    }


    validateSameEmailDoesntExist(self) {
        return (req, res, next) => {
            self.getUserByEmail(req.body.email, self.controller).then((user) => {
                user ? self.sendJson({ error: `User email already exists` }, 400, res) : next();

            }).catch((err) => {
                console.error(err);
                next(err)
            })
        }
    }

    validateSameEmailBelongToSameUser(self) {
        return (req, res, next) => {
            const user = self.getUserByEmail(req.body.email, self.controller);
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
            self.getUserByEmail(req.body.email, self.controller).then((user) => {
                user ? next() : self.sendJson({ error: 'User ${req.body.email' }, 404, res);
            }).catch((err) => next(err));
        }
    }

    verifyUserIsAdmin(self) {
        return (req, res, next) => {
            if (req.user.admin || req.body.comment) {
                next()
            } else {
                self.sendJson({ error: 'you are not authorized' }, 401, res);
            }
        }
    }

    extractUserId(req, res, next) {
        req.body.id = req.params.id;
        next();
    }
}

exports.UsersMiddleware = UsersMiddleware;