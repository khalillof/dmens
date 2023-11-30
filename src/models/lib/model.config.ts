"use strict";

import { Svc } from '../../common/index.js';
import { IModelConfig, IModelConfigParameters, IModelForm, IModelClientData } from '../../interfaces/index.js';
import { ModelForm } from '../index.js';

export class ModelConfig implements IModelConfig {

  constructor(_config: IModelConfigParameters) {
    let { name, dependent, schemaObj, schemaOptions, postPutMiddlewares,
      routeName, useAuth, useAdmin, displayName, searchKey, pagesPerPage,
      queryName, paramId, useComment, useLikes,removeActions, template } = _config;

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
    this.useComment = useComment || false;
    this.useLikes = useLikes || false;
    this.template = template;

    if (queryName)
      this.queryName = queryName;

    if (searchKey)
      this.searchKey = searchKey;

    this.pagesPerPage = pagesPerPage || 5;
    this.schemaObj = schemaObj || {},
    this.schemaOptions = { timestamps: true, strict: true, ...schemaOptions }
    
    this.postPutMiddlewares = this.removeDiplicates(postPutMiddlewares)
    this.removeActions = this.removeDiplicates(removeActions);
  }

  name: string
  dependent: Boolean
  routeName: string;
  baseRoutePath: string;
  routeParam: string;
  paramId: string;
  pagesPerPage: number;
  queryName?: string;
  searchKey?: string;
  displayName: string;
  useAuth: string[];
  useAdmin: string[];
  useComment: boolean
  useLikes: boolean
  template?: string

  schemaObj: object
  schemaOptions?: Record<string, any>
  postPutMiddlewares: string[] // used for post put actions
  removeActions?:string[]
  formCache?: IModelForm

  private removeDiplicates(arr?: any[]) {
    // Set will remove diblicate
    return (arr && Array.isArray(arr)) ? Array.from(new Set(arr)) : []
  }
  getProps(): IModelConfig {
    return {
      ...this.getModelClientData(),
      dependent: this.dependent,
      removeActions:this.removeActions,
      schemaObj: this.schemaObj,
      schemaOptions: this.schemaOptions,
      postPutMiddlewares: this.postPutMiddlewares
    }
  }
  getModelClientData(): IModelClientData {
    return {
      name: this.name,
      routeName: this.routeName,
      baseRoutePath: this.baseRoutePath,
      paramId: this.paramId,
      routeParam: this.baseRoutePath,
      useAuth: this.useAuth,
      useAdmin: this.useAdmin,
      displayName: this.displayName,
      useComment: this.useComment,
      useLikes: this.useLikes,
      template: this.template,
      queryName: this.queryName,
      searchKey: this.searchKey,
      pagesPerPage: this.pagesPerPage
    }
  }
  getRoutes() {
    return Svc.routes.getRoutesPathMethods(this.routeName)
  }

  async genForm(): Promise<IModelForm> {
    if (this.formCache)
      return this.formCache;

    let _form = new ModelForm(this);
    let clone = { ...this.schemaObj };
    await _form.genElements(clone)
    this.formCache = _form;

    return await Promise.resolve(_form)
  }

  //check useAuth and useAdmin and return full list of middlewares
  authAdminMiddlewares(actionName: string): string[] {

    if (this.inAdmin(actionName)) {
      return ['authenticate', 'isAdmin']
    } else if (this.inAuth(actionName)) {
      return ['authenticate']
    } else {
      return []
    }
  }

  inAuth(actionName: string): boolean {
    return this.useAuth.indexOf(actionName) !== -1
  }
  inAdmin(actionName: string): boolean {
    return this.useAdmin.indexOf(actionName) !== -1
  }
}
