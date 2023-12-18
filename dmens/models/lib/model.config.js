"use strict";
import { Svc } from '../../common/index.js';
import { ModelForm } from '../index.js';
export class ModelConfig {
    constructor(_config) {
        let { name, dependent, schemaObj, schemaOptions, postPutMiddlewares, routeName, useAuth, useAdmin, displayName, searchKey, pagesPerPage, queryName, paramId, plugins, removeActions, template } = _config;
        // basic validation
        if (!name || !schemaObj) {
            throw new Error(`ConfigProps class constructor is missing requird properties => ${_config}`);
        }
        this.name = name.toLowerCase();
        if (Svc.db.exist(this.name)) {
            throw new Error(`ConfigProps basic schema validation faild ! name property : ${name} already on db.`);
        }
        this.dependent = dependent || false,
            this.routeName = routeName ? routeName.replace('/', '').toLowerCase() : Svc.routes.pluralizeRoute(this.name);
        this.baseRoutePath = '/' + this.routeName;
        this.paramId = paramId || this.name + 'Id';
        this.routeParam = this.baseRoutePath + '/:' + this.paramId;
        this.useAuth = this.removeDiplicates(useAuth);
        this.useAdmin = this.removeDiplicates(useAdmin);
        this.displayName = displayName || this.name;
        this.plugins = this.removeDiplicates(plugins);
        this.template = template;
        if (queryName)
            this.queryName = queryName;
        if (searchKey)
            this.searchKey = searchKey;
        this.pagesPerPage = pagesPerPage || 5;
        this.schemaObj = schemaObj || {},
            this.schemaOptions = { timestamps: true, strict: true, ...schemaOptions };
        this.postPutMiddlewares = this.removeDiplicates(postPutMiddlewares);
        this.removeActions = this.removeDiplicates(removeActions);
    }
    name;
    dependent;
    routeName;
    baseRoutePath;
    routeParam;
    paramId;
    pagesPerPage;
    queryName;
    searchKey;
    displayName;
    useAuth;
    useAdmin;
    plugins;
    template;
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
            ...this.getModelClientData(),
            dependent: this.dependent,
            removeActions: this.removeActions,
            schemaObj: this.schemaObj,
            schemaOptions: this.schemaOptions,
            postPutMiddlewares: this.postPutMiddlewares
        };
    }
    getModelClientData() {
        return {
            name: this.name,
            routeName: this.routeName,
            baseRoutePath: this.baseRoutePath,
            paramId: this.paramId,
            routeParam: this.baseRoutePath,
            useAuth: this.useAuth,
            useAdmin: this.useAdmin,
            displayName: this.displayName,
            plugins: this.plugins,
            template: this.template,
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
