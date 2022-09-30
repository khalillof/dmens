import { DefaultController } from './default.controller.js';
import { authenticateUser, generateJwt } from '../../services/index.js';
export class AccountsController extends DefaultController {
    constructor(svc) {
        super(svc);
    }
    async signup(req, res, next) {
        let mdl = this.db.model;
        await mdl.register(req.body, req.body.password, this.responce(res).errObjInfo);
    }
    async signin(req, res, next) {
        // local /jwt
        return await authenticateUser('local')(req, res, next);
    }
    async forgetPassword(req, res, next) {
        //Normally setPassword is used when the user forgot the password 
        if (!req.body.email && req.body.password) {
            return this.responce(res).fail('some requied body fields are missing');
        }
        let user = await this.db.findOne({ email: req.body.email });
        if (!user) {
            return this.responce(res).fail('some of your input are not valid');
        }
        else {
            return user.setPassword(req.body.password, this.responce(res).errObjInfo);
        }
    }
    async changePassword(req, res, next) {
        //changePassword is used when the user wants to change the password
        if (req.isUnauthenticated()) {
            this.responce(res).notAuthorized();
        }
        if (!req.body.oldpassword || !req.body.newpassword) {
            return this.responce(res).fail('old and new pasword field are required');
        }
        else {
            let user = await this.db.model.findById(req.user._id);
            return user.changePassword(req.body.oldpassword, req.body.newpassword, this.responce(res).errSuccess);
        }
    }
    profile(req, res, next) {
        return this.responce(res).item(req.user, 'You made it to the secure route');
    }
    async updateUser(req, res, next) {
        if (req.isUnauthenticated()) {
            this.responce(res).notAuthorized();
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
    facebook(req, res, next) {
        if (req.user) {
            var token = generateJwt(req.user);
            res.json({ success: true, token: token, status: 'You are successfully logged in!' });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudHMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90eXBlc2NyaXB0L2NvbnRyb2xsZXJzL2xpYi9hY2NvdW50cy5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFBO0FBQzNELE9BQU8sRUFBRSxnQkFBZ0IsRUFBQyxXQUFXLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQTtBQUV0RSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsaUJBQWlCO0lBRXZELFlBQVksR0FBVztRQUNyQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDWixDQUFDO0lBRUYsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBMEI7UUFDbEYsSUFBSSxHQUFHLEdBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFNLENBQUM7UUFDeEIsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNsRixDQUFDO0lBRUYsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBMEI7UUFDbkYsYUFBYTtRQUNiLE9BQU8sTUFBTSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDRCxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUEwQjtRQUMzRixpRUFBaUU7UUFDakUsSUFBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDO1lBQ3ZDLE9B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