import { DefaultController } from './default.controller.js';
import { authenticateUser, generateJwt } from '../../services/index.js';
import { config } from '../../common/index.js';
export class AuthController extends DefaultController {
    constructor(svc) {
        super(svc);
    }
    async secure(req, res, next) {
        const data = config.getSecret(req.query['api']);
        this.responce(res).data(data);
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
    facebook(req, res, next) {
        if (req.user) {
            var token = generateJwt(req.user);
            res.json({ success: true, token: token, status: 'You are successfully logged in!' });
        }
    }
}
/**
   // check both Bearer tokens accessToken and refeshToken and return both new tokens;
    async  checkAccessRefershTokensAndCreate(req: express.Request, res: express.Response, next: express.NextFunction) {
      let token = this.getToken("x-access-token", req);
      let refersh_token = this.getToken("refersh_token", req);

      if(token && refersh_token){
      verify(token, config.jwtSecret(),async (err:any, user:any) => {
        // prcess if token expired
        if (err) {
          if(err.name === 'TokenExpiredError' || err.message === 'jwt expired'){
           
          await this.check_refresh_create_tokens(user,refersh_token!,res);
          //return logger.resErr(res,err)
          }else{
            return this.responce(res).notAuthorized("not authorized need to sigin!");
          }
        }else{
          // process if token still valid
          await this.check_refresh_create_tokens(user,refersh_token!,res);
          return;
        }
      });
      }else{
        return this.responce(res).notAuthorized("token not provided!");
      }
    };

  private  async  check_refresh_create_tokens(user:any,refersh_token:string, res:express.Response){
      let db_refToken = await dbStore['token'].model?.findOne({ owner: user._id, token:refersh_token});
      if(db_refToken && !isExpiredToken(db_refToken.token)){
           let neRefersh_token = await createRefershToken(user);
           let newSccessToken = generateJwt(user);
           res.json({ success: true, message: "Authentication successful", accessToken: newSccessToken, refershToken: neRefersh_token });
           // update delete old token
           await dbStore['token'].deleteById(db_refToken._id)
           return;
      }else{
        return this.responce(res).notAuthorized("not authorized need to sigin!");
      }
    }

    private getToken(tokenFeild:string,req:express.Request){
      let token = req.headers[tokenFeild];
      if(token && typeof token === 'string'){
        return token;
      }else{
      return null;
      }
    }

  **/ 
