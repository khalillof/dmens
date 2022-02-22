const {DefaultController} = require('./lib/default.controller');
const {UsersController} = require('./lib/users.controller');
const {AuthController} = require('./lib/auth.controller');
const {SchemaController} = require('./lib/schema.controller');

 module.exports ={
    DefaultController,AuthController,UsersController, SchemaController
}