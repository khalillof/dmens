"use strict";
import { Svc } from '../../common/index.js';
import { Form } from '../index.js';
import { RouteData } from './RouteData.js';
export class ConfigProps {
    constructor(_config) {
        let { name, active, schemaObj, schemaOptions, postPutMiddlewares } = _config;
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
        this.routeData = new RouteData(_config);
        this.postPutMiddlewares = this.removeDiplicates(postPutMiddlewares);
    }
    name;
    active;
    routeData;
    schemaObj;
    schemaOptions;
    postPutMiddlewares; // used for post put actions
    formCache;
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
            routeData: this.routeData,
            postPutMiddlewares: this.postPutMiddlewares
        };
    }
    getRoutes() {
        return Svc.routes.getRoutesPathMethods(this.routeData.routeName);
    }
    async genForm() {
        if (this.formCache)
            return this.formCache;
        let _form = new Form(this);
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
        return this.routeData.useAuth.indexOf(actionName) !== -1;
    }
    inAdmin(actionName) {
        return this.routeData.useAdmin.indexOf(actionName) !== -1;
    }
}
