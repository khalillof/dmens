const {DefaultController} = require('./lib/default.controller');
const {UsersController} = require('./lib/users.controller');
const {AuthController} = require('./lib/auth.controller');
const {EditorController} = require('./lib/editor.controller');

 module.exports ={
    DefaultController,AuthController,UsersController, EditorController
}