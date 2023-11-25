"use strict";
import mongoose from 'mongoose';
import { Svc, envs } from '../../common/index.js';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { PassportStrategies } from './strategies.js';
import { ModelConfig } from './model.config.js';
import { autopopulatePlugin } from './autopopulate.js';
export class ModelDb {
    constructor(_config) {
        this.config = (_config instanceof ModelConfig) ? _config : new ModelConfig(_config);
        const { name, schemaObj, schemaOptions } = this.config;
        this.name = name;
        let _schema = new mongoose.Schema(schemaObj, schemaOptions).plugin(autopopulatePlugin);
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
        // add to db store
        Svc.db.add(this);
    }
    name;
    config;
    model;
    count = 0;
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
        let _configDb = Svc.db.get('config');
        if (!_configDb) {
            envs.throwErr(`config model not present on the database, could not create config entry for model :${this.name}`);
        }
        let one = await _configDb.findOne({ name: this.name });
        if (one) {
            await _configDb.putById(one._id, this.config.getProps()); // update config
            envs.logLine('config entery already on database so it has been updated : name: ' + this.name);
        }
        else {
            let rst = await _configDb.create(this.config.getProps());
            envs.logLine(`created config entry for model name : ${rst.name}`);
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
