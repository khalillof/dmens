"use strict";

import { Svc } from '../../common/index.js';
import { IModelConfig, IModelConfigParameters, IModelForm, IModelClientData } from '../../interfaces/index.js';
import { ModelForm} from '../index.js';

export class ModelConfig implements IModelConfig {

  constructor(_config: IModelConfigParameters) {


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
    this.plugins  = this.removeDiplicates(_config.plugins);
  
    this.modelTemplate = _config.modelTemplate;
    this.listTemplate = _config.listTemplate;
    this.queryName =_config. queryName;
    this.searchKey = _config.searchKey;

    this.pagesPerPage = _config.pagesPerPage || 5;
    
    this.schemaOptions = { timestamps: true, strict: true, ..._config.schemaOptions }
    
    this.postPutMiddlewares = this.removeDiplicates(_config.postPutMiddlewares)
    this.removeActions = this.removeDiplicates(_config.removeActions);
    this.modelKeys = Object.keys(_config.schemaObj || {});

  }

  name: string
  dependent: Boolean
  routeName: string;
  baseRoutePath: string;
  routeParam: string;
  paramId: string;
  pagesPerPage: number;
  modelKeys:string[]
  queryName?: string;
  searchKey?: string;
  displayName: string;
  useAuth: string[];
  useAdmin: string[];
  plugins:string[]
  modelTemplate?:string
  listTemplate?:string
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
      ...this.getViewData(),
      dependent: this.dependent,
      removeActions:this.removeActions,
      schemaObj: this.schemaObj,
      schemaOptions: this.schemaOptions,
      postPutMiddlewares: this.postPutMiddlewares
    }
  }
  getViewData(): IModelClientData {
    return {
      name: this.name,
      routeName: this.routeName,
      baseRoutePath: this.baseRoutePath,
      paramId: this.paramId,
      routeParam: this.baseRoutePath,
      modelKeys:this.modelKeys,
      useAuth: this.useAuth,
      useAdmin: this.useAdmin,
      displayName: this.displayName,
      plugins: this.plugins,
      modelTemplate: this.modelTemplate,
      listTemplate: this.listTemplate,
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


