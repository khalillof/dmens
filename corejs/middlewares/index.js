
module.exports = Object.assign(
    {},
    require('./lib/users.middleware'),
    require('./lib/jwt.middleware')
)