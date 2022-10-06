import { isValidRole, dbStore, responce } from '../../common/index.js';
export class Middlewares {
    static async createInstance() {
        return await Promise.resolve(new Middlewares());
    }
    async getUserFromReq(req) {
        return req.body && req.body.email ? await dbStore['account'].findOne({ email: req.body.email }) : null;
    }
    validateRequiredUserBodyFields(req, res, next) {
        if (req.body && req.body.email && req.body.username && req.body.password) {
            next();
        }
        else {
            responce(res).badRequest('Missing required body fields');
        }
    }
    async validateSameEmailDoesntExist(req, res, next) {
        await this.getUserFromReq(req) ? responce(res).badRequest('User email already exists') : next();
    }
    validateCurrentUserOwnParamId(req, res, next) {
        req.user && String(req.user._id) === String(req.params['id']) ? next() : responce(res).unAuthorized();
    }
    validateBodyEmailBelongToCurrentUser(req, res, next) {
        req.user && req.body.email && req.body.email === req.user.email ? next() : responce(res).unAuthorized();
    }
    validateHasQueryEmailBelongToCurrentUser(req, res, next) {
        req.user && req.query.email && req.query.email === req.user.email ? next() : responce(res).forbidden('not authorized, require valid email');
    }
    async userExist(req, res, next) {
        await this.getUserFromReq(req) ? next() : responce(res).forbidden('User does not exist : ' + req.body.email);
    }
    isAuthenticated(req, res, next) {
        req.isAuthenticated() ? next() : responce(res).unAuthorized();
    }
    // roles
    isRolesExist(roles) {
        if (roles) {
            for (let i = 0; i < roles.length; i++) {
                if (!isValidRole(roles[i])) {
                    return false;
                }
            }
        }
        return true;
    }
    ;
    isInRole(roleName) {
        return async (req, res, next) => {
            if (!req.isAuthenticated()) {
                responce(res).forbidden('require authentication');
                return;
            }
            let reqUser = req.user && req.user.roles ? req.user : await dbStore['account'].findById(req.user._id);
            let roles = await dbStore['role'].model.find({ _id: { $in: reqUser.roles } });
            if (roles && roles.length > 0) {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === roleName) {
                        next();
                        return;
                    }
                }
            }
            responce(res).forbidden("Require Admin Role!");
            return;
        };
    }
}
