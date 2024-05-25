"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDb = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const index_js_1 = require("../../common/index.js");
const index_js_2 = require("../../services/index.js");
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_local_mongoose_1 = tslib_1.__importDefault(require("passport-local-mongoose"));
const strategies_js_1 = require("./strategies.js");
const model_config_js_1 = require("./model.config.js");
const autopopulate_js_1 = require("./autopopulate.js");
class ModelDb {
    constructor(_config) {
        this.config = (_config instanceof model_config_js_1.ModelConfig) ? _config : new model_config_js_1.ModelConfig(_config);
        const { name, schemaObj, schemaOptions } = this.config;
        this.name = name;
        let _schema = new mongoose_1.default.Schema(schemaObj, schemaOptions).plugin(autopopulate_js_1.autopopulatePlugin);
        if (this.name === 'account') {
            _schema?.plugin(passport_local_mongoose_1.default);
            const Account = mongoose_1.default.model(this.name, _schema);
            //passport.use(new Strategy(User.authenticate()));
            //local strategy
            passport_1.default.use(Account.createStrategy());
            passport_1.default.serializeUser(Account.serializeUser());
            passport_1.default.deserializeUser(Account.deserializeUser());
            // extras
            // strategy jwt || az
            passport_1.default.use(strategies_js_1.PassportStrategies.getAuthStrategy());
            // assign
            this.model = Account;
        }
        else {
            this.model = mongoose_1.default.model(this.name, _schema);
        }
        // add to db store
        index_js_2.Store.db.add(this);
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
        let _configDb = index_js_2.Store.db.get('config');
        if (!_configDb) {
            index_js_1.envs.throwErr(`config model not present on the database, could not create config entry for model :${this.name}`);
        }
        let one = await _configDb.findOne({ name: this.name });
        if (one) {
            await _configDb.putById(one._id, this.config.getProps()); // update config
            index_js_1.envs.logLine('config entery already on database so it has been updated : name: ' + this.name);
        }
        else {
            let rst = await _configDb.create(this.config.getProps());
            index_js_1.envs.logLine(`created config entry for model name : ${rst.name}`);
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
exports.ModelDb = ModelDb;
