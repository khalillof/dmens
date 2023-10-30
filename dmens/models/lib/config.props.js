"use strict";
import { Svc } from '../../common/index.js';
import { Form } from '../index.js';
export class ConfigProps {
    constructor(_config) {
        let { name, active, schemaObj, schemaOptions, routeName, useAuth, useAdmin, postPutMiddlewares, displayName, searchKey, pagesPerPage, queryName, useComment, uselikes, param } = _config;
        // basic validation
        if (!name || !schemaObj) {
            throw new Error(`ConfigProps class constructor is missing requird properties => ${_config}`);
        }
        if (Svc.db.exist(name.toLowerCase())) {
            throw new Error(`ConfigProps basic schema validation faild ! name property : ${name} already on db.`);
        }
        this.name = name.toLowerCase(),
            this.active = active || false,
            this.schemaObj = schemaObj || {},
            this.schemaOptions = { timestamps: true, strict: true, ...schemaOptions };
        this.routeName = routeName && routeName?.toLocaleLowerCase() || Svc.routes.pluralizeRoute(name);
        this.param = param || this.name + 'Id';
        this.routeParam = this.routeName + '/:' + this.param;
        this.useAuth = this.removeDiplicates(useAuth),
            this.useAdmin = this.removeDiplicates(useAdmin);
        this.postPutMiddlewares = this.removeDiplicates(postPutMiddlewares);
        this.displayName = displayName || this.routeName.replace('/', '');
        queryName && (this.queryName = queryName);
        searchKey && (this.searchKey = searchKey);
        this.pagesPerPage = pagesPerPage || 5;
        this.useComment = useComment;
        this.uselikes = uselikes;
    }
    name;
    active;
    schemaObj;
    schemaOptions;
    routeName;
    routeParam;
    param;
    pagesPerPage;
    queryName;
    searchKey;
    displayName;
    useAuth;
    useAdmin;
    postPutMiddlewares; // used for post put actions
    useComment;
    uselikes;
    removeDiplicates(arr) {
        // Set will remove diblicate
        return (arr && Array.isArray(arr)) ? Array.from(new Set(arr)) : [];
    }
    getProps() {
        return {
            name: this.name,
            active: this.active,
            schemaObj: this.schemaObj,
            schemaOptions: this.schemaOptions,
            routeName: this.routeName,
            param: this.param,
            routeParam: this.routeParam,
            useAuth: this.useAuth,
            useAdmin: this.useAdmin,
            displayName: this.displayName,
            searchKey: this.searchKey,
            pagesPerPage: this.pagesPerPage,
            postPutMiddlewares: this.postPutMiddlewares
        };
    }
    getRoutes() {
        return Svc.routes.getRoutesPathMethods(this.routeName);
    }
    async genForm() {
        return await new Form(this).genElements(this);
    }
    //check useAuth and useAdmin and return full list of middlewares
    authAdminMiddlewares(actionName) {
        let result = [];
        this.inAuth(actionName) && result.push('authenticate');
        this.inAdmin(actionName) && result.push('isAdmin');
        return result;
    }
    inAuth(action) {
        return this.useAuth.indexOf(action) !== -1;
    }
    inAdmin(action) {
        return this.useAdmin.indexOf(action) !== -1;
    }
}
