"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbInit = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const index_js_1 = require("../../common/index.js");
const index_js_2 = require("../../models/index.js");
/////////////////
const dbOptions = {
    //rejectUnauthorized: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //retryWrites: false
};
async function dbInit() {
    try {
        index_js_1.envs.logLine('db connction string :' + index_js_1.envs.databaseUrl());
        await mongoose_1.default.connect(index_js_1.envs.databaseUrl());
        console.log("Successfully Connected to db!");
        // Create Configration - Account - default directory  db models and routes
        await index_js_2.Operations.create_default_models_routes();
        index_js_1.envs.logLine(`Numbers of models on the database are : ${index_js_1.dbStore.length}`);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
exports.dbInit = dbInit;
