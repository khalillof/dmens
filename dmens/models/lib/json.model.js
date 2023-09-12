"use strict";
import mongoose from 'mongoose';
import { dbStore } from '../../common/index.js';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { PassportStrategies } from './strategies.js';
export class JsonObject {
    constructor(jsonSchema) {
        this.validate(jsonSchema);
        this.name = jsonSchema.name.toLowerCase() || "";
        this.schema = new mongoose.Schema(jsonSchema.schema, { timestamps: true });
        // check if populate not empty, then new Set() will get red of duplicate values
        this.populates = (jsonSchema.populates && jsonSchema.populates.length) ? Array.from(new Set(jsonSchema.populates)) : [];
        jsonSchema.useAdmin && (this.useAuth = jsonSchema.useAuth);
        jsonSchema.useAdmin && (this.useAdmin = jsonSchema.useAdmin);
    }
    name;
    schema;
    populates;
    useAuth;
    useAdmin;
    validate(jsonSchema) {
        if (!jsonSchema)
            throw new Error('jsonSchema id required parameter');
        if (!jsonSchema.name)
            throw new Error(' schema validation faild ! property name is required');
        if (dbStore[jsonSchema.name.toLowerCase()])
            throw new Error(`schema validation faild ! name property : ${jsonSchema.name} already on db : `);
    }
}
export class JsonModel extends JsonObject {
    constructor(jsonSchema, callback) {
        super(jsonSchema);
        let self = this;
        this.hasPopulate = this.populates.length ? true : false;
        if (this.name === 'account') {
            this.schema.plugin(passportLocalMongoose);
            const Account = mongoose.model(this.name, this.schema);
            //passport.use(new Strategy(User.authenticate()));
            //local strategy
            passport.use(Account.createStrategy());
            passport.serializeUser(Account.serializeUser());
            passport.deserializeUser(Account.deserializeUser());
            // extras
            // jwt strategy
            passport.use(PassportStrategies.JwtAuthHeaderAsBearerTokenStrategy());
            passport.use(PassportStrategies.azBearerStrategy());
            //passport.use(PassportStrategies.FacebookToken());
            //passport.use(PassportStrategies.JwtQueryParameterStrategy());
            // assign
            this.model = Account;
        }
        else {
            this.model = mongoose.model(this.name, this.schema);
        }
        //this.#loadPopulates(jsonSchema?.schema); 
        if (this.hasPopulate) {
            this.#buildPopulates();
            self.Tolist = new Function('filter={}', 'limit=5', 'page=1', 'sort=1', `return this.model.find(filter).limit(limit).skip((page -1) * limit).sort({'createdAt': sort})${this.#populateQuery}`);
            self.findById = new Function('id', `return this.model.findById(id)${this.#populateQuery}`);
            self.findOne = new Function('filter', `return this.model.findOne(filter)${this.#populateQuery}`);
        }
        // check callback
        callback && typeof callback === 'function' && callback(this);
        // add to db store
        dbStore[this.name] = this;
        console.log("added ( " + this.name + " ) to DbStore :");
    }
    model;
    count = 0;
    hasPopulate = false;
    #populateQuery = "";
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
    //check useAuth and useAdmin
    checkAuth(method) {
        return [
            (this.useAuth && this.useAuth.length ? this.useAuth.indexOf(method) !== -1 : false),
            (this.useAdmin && this.useAdmin.length ? this.useAdmin.indexOf(method) !== -1 : false)
        ];
    }
    #buildPopulates() {
        if (this.hasPopulate) {
            for (let item of this.populates) {
                this.#populateQuery += ".populate('" + item + "')";
            }
        }
        this.#populateQuery += ".exec()";
    }
    #loadPopulates(_schema) {
        // check and load populates
        Object.entries(_schema ?? this.schema.obj).forEach((item, indx, arr) => this.#deepSearch(item, indx, arr));
        this.#buildPopulates();
    }
    // search item in object and map to mongoose schema
    #deepSearch(obj, indx, arr) {
        // loop over the item
        for (let [itemKey, itemValue] of Object.entries(obj)) {
            // check if item is object then call deepSearch agin recursively
            if (typeof itemValue === "object") {
                this.#deepSearch(itemValue, indx, arr);
            }
            else {
                if (itemKey === 'ref') {
                    //console.log(arr[indx][0])
                    this.populates.push(arr[indx][0]);
                }
            }
        }
    }
    static async createInstance(jsonModel, callback) {
        let dbb = new JsonModel(jsonModel, callback);
        return Promise.resolve(dbb);
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
