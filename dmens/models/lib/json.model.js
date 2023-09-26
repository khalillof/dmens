"use strict";
import mongoose from 'mongoose';
import { dbStore } from '../../common/index.js';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { PassportStrategies } from './strategies.js';
import { ConfigProps } from './ConfigProps.js';
import { autopopulatePlugin } from './autopopulate.js';
export class DbModel extends ConfigProps {
    constructor(_config, callback) {
        super(_config);
        let _schema = new mongoose.Schema(this.schemaObj, this.schemaOptions).plugin(autopopulatePlugin);
        if (this.name === 'account') {
            _schema?.plugin(passportLocalMongoose);
            const Account = mongoose.model(this.name, _schema);
            //passport.use(new Strategy(User.authenticate()));
            //local strategy
            passport.use(Account.createStrategy());
            passport.serializeUser(Account.serializeUser());
            passport.deserializeUser(Account.deserializeUser());
            // extras
            // strategy jwt || az
            passport.use(PassportStrategies.getAuthStrategy());
            // assign
            this.model = Account;
        }
        else {
            this.model = mongoose.model(this.name, _schema);
        }
        // check callback
        callback && typeof callback === 'function' && callback(this);
        // add to db store
        dbStore[this.name] = this;
        console.log("added ( " + this.name + " ) to DbStore :");
    }
    //readonly config: IConfigration
    model;
    count = 0;
    getConfigProps() {
        return {
            name: this.name,
            active: this.active,
            useAdmin: this.useAdmin,
            useAuth: this.useAuth,
            schemaObj: this.schemaObj,
            schemaOptions: this.schemaOptions
        };
    }
    //check useAuth and useAdmin
    checkAuth(method) {
        return [
            (this.useAuth && this.useAuth.length ? this.useAuth.indexOf(method) !== -1 : false),
            (this.useAdmin && this.useAdmin.length ? this.useAdmin.indexOf(method) !== -1 : false)
        ];
    }
    async initPostDatabaseSeeding() {
        // count
        this.count = await this.model.count();
        // create document watcher to notify you on document changes so you can update documents count property
        this.model.watch().on('change', async (change) => {
            this.count = await this.model?.count() ?? 0;
            console.log('number of documents counted are :' + this.count);
            //console.log(JSON.stringify(change))
        });
        //console.log(`Number of documents on database for :( ${this.name} ) is ${this.count}`)
        console.log(`Finished creating databse event on change for model :( ${this.name} )`);
    }
    async createConfig() {
        if (this.name === "config") {
            return;
        }
        let _configDb = dbStore['config'];
        if (!_configDb) {
            throw new Error(`config model not present on the database, could not create config entry for model :${this.name}`);
        }
        let one = await _configDb.findOne({ name: this.name });
        if (one) {
            console.log('config entery already on database');
        }
        else {
            let rst = await _configDb.create(this.getConfigProps());
            console.log(`created config entry for model name : ${rst.name}`);
        }
    }
    // sort, use 1 for asc and -1 for dec
    async Tolist(filter, limit, page, sort) {
        return await this.model.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ 'createdAt': sort })
            .exec();
        // .skip(settings.limit * settings.page)
    }
    async findById(id) {
        return await this.model.findById(id);
    }
    async findOne(query) {
        return await this.model.findOne(query);
    }
    async create(obj) {
        return await this.model?.create(obj);
    }
    async putById(id, objFields) {
        return await this.model?.findByIdAndUpdate(id, objFields);
    }
    async deleteById(id) {
        return await this.model?.findByIdAndDelete(id);
    }
    async deleteByQuery(query) {
        return await this.model?.findOneAndDelete(query);
    }
    async patchById(objFields) {
        return await this.model?.findOneAndUpdate(objFields._id, objFields);
    }
}
