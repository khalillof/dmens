"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const default_controller_js_1 = require("./default.controller.js");
const index_js_1 = require("../../common/index.js");
const index_js_2 = require("../../services/index.js");
const index_js_3 = require("../../models/index.js");
class ConfigController extends default_controller_js_1.DefaultController {
    constructor(name = 'config') {
        super(name);
    }
    async routes(req, res, next) {
        let routes = index_js_2.Store.route.getRoutesPathMethods();
        this.responce(res).data(routes);
    }
    async deleteRoute(req, res, next) {
        if (!req.query && !req.query['path'] && !(typeof req.query['path'] === 'string')) {
            return this.responce(res).badRequest('require query string path');
        }
        index_js_2.Store.route.deleteRoutePath(req.query['path']);
        this.responce(res).success();
    }
    async viewsData(req, res, next) {
        let data = await Promise.all(index_js_2.Store.db.store.filter(async (d) => d.config.dependent === false).map(async (a) => a.config.getViewData()));
        // console.log(data)
        this.responce(res).data(data);
    }
    async forms(req, res, next) {
        let _forms = await Promise.all(index_js_2.Store.db.store.map(async (d) => await d.config.genForm()));
        this.responce(res).data(_forms);
    }
    async create(req, res, next) {
        let conf = req.body;
        let result = await index_js_3.Operations.createModelConfigRoute(conf);
        index_js_1.envs.logLine('document created or Overrided :', result.controller?.db.name);
        this.responce(res).data(result.controller.db.config.getProps());
    }
    async update(req, res, next) {
        let id = req.params['id'];
        let config = (id && await this.db.findById(id)) || req.body.name && await this.db.findOne({ name: req.body.name });
        let result = await index_js_3.Operations.overrideModelConfigRoute({ ...config, ...req.body });
        index_js_1.envs.logLine('document created or Overrided :', result.controller?.db.name);
        this.responce(res).success();
    }
    async delete(req, res, next) {
        let id = req.params['id'];
        let item = await this.db.findById(id);
        if (item) {
            // delete config record on database
            await this.db.deleteById(id);
            // if there is db deleted
            index_js_2.Store.db.delete(item.name);
            // delete app route
            index_js_2.Store.route.deleteAppRoute(item.routeName);
            console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`);
            this.responce(res).success();
        }
        else {
            this.responce(res).notFound();
        }
    }
}
exports.ConfigController = ConfigController;
