import express from 'express';
import { UsersController } from '../../controllers/users.controller';
import { JwtService } from '../../auth/services/jwt.service'
import { verify } from 'argon2';

class UsersMiddleware {
    Controller: any
    constructor() {
        this.Controller = UsersController.createInstance();
    }
    static async createInstance() {
        return await Promise.resolve(new UsersMiddleware())
    }
    verifyUser: any = JwtService.verifyUser;


    validateRequiredUserBodyFields(self: any) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (req.body && req.body.email && req.body.password) {
                next();
            } else {
                self.sendJson({ error: 'Missing body fields: email, password' }, 400, res);
            }
        }
    }

    verifyUserPassword(self: any) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            self.getUserByEmail(req.body.email, self.controller).then(async (user: any) => {
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
            }).catch((err: any) => next(err));
        }
    }

    validateSameEmailDoesntExist(self: any) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            self.getUserByEmail(req.body.email, self.controller).then((user: any) => {
                user ? self.sendJson({ error: `User email already exists` }, 400, res) : next();

            }).catch((err: any) => {
                console.error(err);
                next(err)
            })
        }
    }

    validateSameEmailBelongToSameUser(self: any) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const user = self.getUserByEmail(req.body.email, self.controller);
            if (user && user.id === req.params.userId) {
                next();
            } else {
                self.sendJson({ error: `Invalid email` }, 400, res);
            }
        }
    }

    // Here we need to use an arrow function to bind `this` correctly
    validatePatchEmail(self: any) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (req.body.email) {
                self.validateSameEmailBelongToSameUser(req, res, next);
            } else {
                next();
            }
        }
    }

    validateUserExists(self: any) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            self.getUserByEmail(req.body.email).then((user: any) => {
                user ? next() : self.sendJson({ error: 'User ${req.body.email' }, 404, res);
            }).catch((err: any) => next(err));
        }
    }
    
    verifyUserIsAdmin(self: any) {
        return (req: any, res: any, next: any) => {

            if (req.user.admin || req.body.comment) {
                next()
            } else {
                self.sendJson({ error: 'you are not authorized' }, 401, res);
            }
        }
    }

    extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }

}

export default UsersMiddleware;