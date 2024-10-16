"use strict";

import { Store } from '../../services/index.js';
import { IModelConfig, IModelConfigParameters, IModelForm, IModelViewData } from '../../interfaces/index.js';
import { ModelForm} from '../index.js';

export class ModelConfig implements IModelConfig {

  constructor(_config: IModelConfigParameters) {


    // basic validation
    if (!_config.name || !_config.schemaObj) {
      throw new Error(`ConfigProps class constructor is missing requird properties => ${_config}`);
    }
    this.name = _config.name.toLowerCase();

    if (Store.db.exist(this.name)) {
      throw new Error(`ConfigProps basic schema validation faild ! name property : ${_config.name} already on db.`);
    }

    this.dependent = _config.dependent || false,
    this.schemaObj = _config.schemaObj || {},

    this.routeName = _config.routeName ? _config.routeName.replace('/', '').toLowerCase() : Store.route.pluralizeRoute(this.name);
    this.userAuth = this.removeDiplicates(_config.userAuth);
    this.adminAuth = this.removeDiplicates(_config.adminAuth);
    this.plugins  = this.removeDiplicates(_config.plugins);
  
    this.modelTemplate = _config.modelTemplate;
    this.listTemplate = _config.listTemplate;
    this.searchKey = _config.searchKey;
    
    this.schemaOptions = { timestamps: true, strict: true, ..._config.schemaOptions }

    this.modelKeys = Object.keys(_config.schemaObj || {});

  }

  name: string
  dependent: Boolean
  routeName: string;
  modelKeys:string[]
  queryName?: string;
  searchKey?: string;
  userAuth: string[];
  adminAuth: string[];
  plugins:string[]
  modelTemplate?:string
  listTemplate?:string
  schemaObj: object
  schemaOptions?: Record<string, any>
  formCache?: IModelForm

  private removeDiplicates(arr?: any[]) {
    // Set will remove diblicate
    return (arr && Array.isArray(arr)) ? Array.from(new Set(arr)) : []
  }
  getProps(): IModelConfig {
    return {
      ...this.getViewData(),
      dependent: this.dependent,
      schemaObj: this.schemaObj,
      authAdminMiddlewares:this.authAdminMiddlewares,
      schemaOptions: this.schemaOptions,
    }
  }
  getViewData(): IModelViewData {
    return {
      name: this.name,
      routeName: this.routeName,
      modelKeys:this.modelKeys,
      userAuth: this.userAuth,
      adminAuth: this.adminAuth,
      plugins: this.plugins,
      modelTemplate: this.modelTemplate,
      listTemplate: this.listTemplate,
      searchKey: this.searchKey,
    }
  }
  getRoutes() {
    return Store.route.getRoutesPathMethods(this.routeName)
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

    if (this.inAdminAuth(actionName)) {
      return ['authenticate', 'isAdmin']
    } else if (this.inUserAuth(actionName)) {
      return ['authenticate']
    } else {
      return []
    }
  }

  inUserAuth(actionName: string): boolean {
    return this.userAuth.indexOf(actionName) !== -1
  }
  inAdminAuth(actionName: string): boolean {
    return this.adminAuth.indexOf(actionName) !== -1
  }
}


