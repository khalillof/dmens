import { DefaultController } from './default.controller.js';
import { authenticateLocal } from '../../services/index.js';
import { envs } from '../../common/index.js';
export class AccountController extends DefaultController {
    constructor() {
        super('account');
    }
    async secure(req, res, next) {
        const data = envs.getSecret(req.query['api']);
        this.responce(res).data(data);
    }
    async signup(req, res, next) {
        let mdl = this.db.model;
        await mdl.register(req.body, req.body.password, this.responce(res).errObjInfo);
    }
    async signin(req, res, next) {
        // local /jwt
        return await authenticateLocal(req, res, next);
    }
    async forgetPassword(req, res, next) {
        //Normally setPassword is used when the user forgot the password 
        if (!req.body.email && req.body.password) {
            return this.responce(res).badRequest('some requied body fields are missing');
        }
        let user = await this.db.findOne({ email: req.body.email });
        if (!user) {
            return this.responce(res).badRequest('some of your input are not valid');
        }
        else {
            return user.setPassword(req.body.password, this.responce(res).errObjInfo);
        }
    }
    async changePassword(req, res, next) {
        //changePassword is used when the user wants to change the password
        if (req.isUnauthenticated()) {
            this.responce(res).unAuthorized();
        }
        if (!req.body.oldpassword || !req.body.newpassword) {
            return this.responce(res).fail('old and new pasword field are required');
        }
        else {
            let user = await this.db.model.findById(req.user._id);
            return user.changePassword(req.body.oldpassword, req.body.newpassword, this.responce(res).errSuccess);
        }
    }
    async profile(req, res, next) {
        //let item = await this.db.findById(String(req.user._id));
        return this.responce(res).data(req.user, 'You made it to the secure route');
    }
    async updateUser(req, res, next) {
        if (req.isUnauthenticated()) {
            this.responce(res).unAuthorized();
        }
        else {
            // user is already authenticated that is why I am checking for body.password only
            let User = await this.db.findById(req.params.id);
            if (req.user.password !== req.body.password)
                await User.setPassword(req.body.password);
            await User.save(req.body, this.responce(res).errObjInfo);
        }
    }
    logout(req, res, next) {
        req.logOut();
        if (req.session) {
            req.session.destroy();
            res.clearCookie('session-id');
            //res.redirect('/');
            this.responce(res).success("You are logged out!");
        }
        else {
            this.responce(res).success("You are not logged in!");
        }
    }
}
