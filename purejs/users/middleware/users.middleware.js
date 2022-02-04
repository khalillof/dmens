"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const {returnJson} = require('../../common/customTypes/types.config');
const {JwtService} = require('../../auth/services/jwt.service');
const { UsersController} = require('../../controllers/users.controller');
const argon2 = require('argon2');

class UsersMiddleware {
 
    constructor(){
        this.Controller = UsersController.createInstance('/users');
    }
    static async createInstance(){
        let usm = new UsersMiddleware()
        return await Promise.resolve(usm)
    }
    verifyUser =  new JwtService().verifyUser;
    
    async validateRequiredUserBodyFields(req, res, next) {
        if(req.body && req.body.email && req.body.password){
            next();
        }else{
            returnJson({error: 'Missing body fields: email, password'}, 400,res);
        }
    }

    async verifyUserPassword(req, res, next) {

        await this.Controller.getUserByEmail(req.body.email).then(async (user)=>{
        if (user) {
            let passwordHash = user.password;
            if (await argon2.verify(passwordHash, req.body.password)) {
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
                returnJson({error: 'Invalid e-mail and/or password'}, 400,res);
            }
        } else {
            returnJson({error: 'Invalid e-mail and/or password'}, 400,res);
        }
    }).catch((err)=> next(err));
    }

    async validateSameEmailDoesntExist(req, res, next) {

       await this.Controller.getUserByEmail(req.body.email).then((user)=>{
          user ? returnJson({error: `User email already exists`}, 400, res): next();

        }).catch((err)=>{
            console.error(err);
            next(err)
        })      
    }

    async validateSameEmailBelongToSameUser(req, res, next) {

        const user = await this.Controller.getUserByEmail(req.body.email);
        if (user && user.id === req.params.userId) {
            next();
        } else {
            returnJson({error: `Invalid email`}, 400, res);
        }
    }

    // Here we need to use an arrow function to bind `this` correctly
   async validatePatchEmail(req, res, next) {
        if (req.body.email) {           
            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    }

    async validateUserExists(req, res, next) {

        await this.Controller.getUserByEmail(req.body.email).then((user) => {            
             user ? next(): returnJson({error: 'User ${req.body.email'},404,res);           
          }).catch((err) => next(err));
    }

   async verifyUserIsAdmin(req, res, next){
       
        if (req.user.admin || req.body.comment){
            next() 
         }else{
          returnJson({error: 'you are not authorized'},401,res);
         }
    }  

    async extractUserId(req, res, next) {
        req.body.id = req.params.id;
        next();
    }
}

exports.UsersMiddleware = UsersMiddleware;