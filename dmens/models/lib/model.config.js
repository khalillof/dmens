"use strict";
import { Svc } from '../../common/index.js';
import { ModelForm } from '../index.js';
export class ModelConfig {
    constructor(_config) {
        // basic validation
        if (!_config.name || !_config.schemaObj) {
            throw new Error(`ConfigProps class constructor is missing requird properties => ${_config}`);
        }
        this.name = _config.name.toLowerCase();
        if (Svc.db.exist(this.name)) {
            throw new Error(`ConfigProps basic schema validation faild ! name property : ${_config.name} already on db.`);
        }
        this.dependent = _config.dependent || false,
            this.schemaObj = _config.schemaObj || {},
            this.routeName = _config.routeName ? _config.routeName.replace('/', '').toLowerCase() : Svc.routes.pluralizeRoute(this.name);
        this.baseRoutePath = '/' + this.routeName;
        this.paramId = _config.paramId || this.name + 'Id';
        this.routeParam = this.baseRoutePath + '/:' + this.paramId;
        this.useAuth = this.removeDiplicates(_config.useAuth);
        this.useAdmin = this.removeDiplicates(_config.useAdmin);
        this.displayName = _config.displayName || this.name;
        this.plugins = this.removeDiplicates(_config.plugins);
        this.modelTemplate = _config.modelTemplate;
        this.listTemplate = _config.listTemplate;
        this.queryName = _config.queryName;
        this.searchKey = _config.searchKey;
        this.pagesPerPage = _config.pagesPerPage || 5;
        this.schemaOptions = { timestamps: true, strict: true, ..._config.schemaOptions };
        this.postPutMiddlewares = this.removeDiplicates(_config.postPutMiddlewares);
        this.removeActions = this.removeDiplicates(_config.removeActions);
        this.modelKeys = Object.keys(_config.schemaObj || {});
        this.description = _config.description || `Template model for read create update and delete data operations `;
    }
    name;
    description;
    dependent;
    routeName;
    baseRoutePath;
    routeParam;
    paramId;
    pagesPerPage;
    modelKeys;
    queryName;
    searchKey;
    displayName;
    useAuth;
    useAdmin;
    plugins;
    modelTemplate;
    listTemplate;
    schemaObj;
    schemaOptions;
    postPutMiddlewares; // used for post put actions
    removeActions;
    formCache;
    removeDiplicates(arr) {
        // Set will remove diblicate
        return (arr && Array.isArray(arr)) ? Array.from(new Set(arr)) : [];
    }
    getProps() {
        return {
            ...this.getViewData(),
            dependent: this.dependent,
            description: this.description,
            removeActions: this.removeActions,
            schemaObj: this.schemaObj,
            schemaOptions: this.schemaOptions,
            postPutMiddlewares: this.postPutMiddlewares
        };
    }
    getViewData() {
        return {
            name: this.name,
            routeName: this.routeName,
            baseRoutePath: this.baseRoutePath,
            paramId: this.paramId,
            routeParam: this.baseRoutePath,
            modelKeys: this.modelKeys,
            useAuth: this.useAuth,
            useAdmin: this.useAdmin,
            displayName: this.displayName,
            plugins: this.plugins,
            modelTemplate: this.modelTemplate,
            listTemplate: this.listTemplate,
            queryName: this.queryName,
            searchKey: this.searchKey,
            pagesPerPage: this.pagesPerPage
        };
    }
    getRoutes() {
        return Svc.routes.getRoutesPathMethods(this.routeName);
    }
    async genForm() {
        if (this.formCache)
            return this.formCache;
        let _form = new ModelForm(this);
        let clone = { ...this.schemaObj };
        await _form.genElements(clone);
        this.formCache = _form;
        return await Promise.resolve(_form);
    }
    //check useAuth and useAdmin and return full list of middlewares
    authAdminMiddlewares(actionName) {
        if (this.inAdmin(actionName)) {
            return ['authenticate', 'isAdmin'];
        }
        else if (this.inAuth(actionName)) {
            return ['authenticate'];
        }
        else {
            return [];
        }
    }
    inAuth(actionName) {
        return this.useAuth.indexOf(actionName) !== -1;
    }
    inAdmin(actionName) {
        return this.useAdmin.indexOf(actionName) !== -1;
    }
}
