"use strict";
import { Svc } from '../../common/index.js';
import { Form } from '../index.js';
export class ConfigProps {
    constructor(_config) {
        let { name, active, schemaObj, schemaOptions, routeName, useAuth, useAdmin, middlewares } = _config;
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
        this.routeName = routeName && routeName?.toLocaleLowerCase() || Svc.routes.pluralizeRoute(name),
            this.useAuth = this.removeDiplicates(useAuth),
            this.useAdmin = this.removeDiplicates(useAdmin);
        this.middlewares = this.removeDiplicates(middlewares);
    }
    name;
    active;
    schemaObj;
    schemaOptions;
    routeName;
    useAuth;
    useAdmin;
    middlewares; // used for post put actions
    removeDiplicates(arr) {
        // Set will remove diblicate
        return (arr && Array.isArray(arr)) ? Array.from(new Set(arr)) : [];
    }
    getConfigProps() {
        return {
            name: this.name,
            active: this.active,
            schemaObj: this.schemaObj,
            schemaOptions: this.schemaOptions,
            routeName: this.routeName,
            useAuth: this.useAuth,
            useAdmin: this.useAdmin,
            middlewares: this.middlewares
        };
    }
    getRoutes() {
        return Svc.routes.getRoutesPathMethods(this.routeName);
    }
    async genForm() {
        return await new Form(this).genElements(this);
    }
    //check useAuth and useAdmin and return full list of middlewares
    checkAuthGetMiddlewares(actionName) {
        if (this.useAuth.indexOf(actionName) !== -1)
            this.middlewares.push('authenticate');
        if (this.useAdmin.indexOf(actionName) !== -1)
            this.middlewares.push('isAdmin');
        return this.middlewares;
    }
}
