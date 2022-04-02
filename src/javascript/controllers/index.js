
module.exports = Object.assign(
    {},
    require('./lib/default.controller'),
    require('./lib/accounts.controller'),
    require('./lib/auth.controller'),
    require('./lib/admin.controller')
);