
module.exports = Object.assign(
    {},
    require('./lib/default.controller'),
    require('./lib/users.controller'),
    require('./lib/auth.controller'),
    require('./lib/editor.controller'),
);