const { config, dbStore, Roles }= require('../../common')

class SeedDatabase {
    // add default roles
constructor(){
    this.addRoles();
    this.addAdminAccount()
    console.log('finished database seeding .........!')
}
    addRoles() {
        let roleDb = dbStore['role'].model;
        roleDb.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                Roles.forEach((role)=> {
                    new roleDb({
                        name: role
                    }).save((err, obj) => err ? console.log("seed Roles error :", err) : console.log(`added ${obj.name} to roles collection`));
                });
            }
        });
    }

    addAdminAccount() {
        let userDb = dbStore['account'].model;
        userDb.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                dbStore['role'].model.find((err, roles) => {

                    if (roles) {
                        let adminUserRoles = roles.map(r => { if ('user admin'.indexOf(r.name) !== -1) return r._id })

                        // add admin Account
                        let _user = {
                            email: config.admin_email,
                            username: config.admin_userName,
                            roles: adminUserRoles,
                            active: true,
                            descriptions: 'this is seeded admin accoun'

                        };
                        userDb.register(_user, config.admin_password, (err, user,info) => {
                            if (err || info) {
                                console.log("seed admin account error :", err || info)
                            } else {
                                console.log(`added admin account to Accounts collection.\nadmin Roles are: ${user.roles}`);

                            }
                        })
                    }
                    if (err) console.log(err.stack)
                });

            }
        });
    }
}

exports.SeedDatabase = SeedDatabase;