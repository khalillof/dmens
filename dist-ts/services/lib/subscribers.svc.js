"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
const tslib_1 = require("tslib");
const events_1 = tslib_1.__importDefault(require("events"));
exports.EventEmitter = new events_1.default.EventEmitter();
// create event which will be fired later by diffrent services
exports.EventEmitter.on('signup', async (data) => {
    // send email or do any thing
    console.log('new user signup data:');
    console.log(data);
});
// implemet this in user service when user signup
async function signup(user) {
    // emit 'signup' event
    exports.EventEmitter.emit('signup', user);
}
