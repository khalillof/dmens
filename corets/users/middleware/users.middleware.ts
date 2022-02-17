import express from 'express';
import { UsersController } from '../../controllers';
import { AuthService } from '../../auth/services/auth.service'

class UsersMiddleware {
    Controller: any
    constructor() {
        this.Controller = UsersController.createInstance();
    }
    static async createInstance() {
        return await Promise.resolve(new UsersMiddleware())
    }
    verifyUser: any = AuthService.authenticateUser;


    validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction){
            if (req.body && req.body.email || req.body.username && req.body.password) {
                next();
            } else {
                res.json({success:false, error: 'Missing required body fields' });
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
    
    verifyUserIsAdmin(req: any, res: express.Response, next: express.NextFunction){

            if (req.user && req.user.admin) {
                next()
            } else {
                res.json({success:false, error: 'you are not authorized' });
            }
        
    }

    extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }

}

export default UsersMiddleware;