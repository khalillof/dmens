"use strict";

import { Svc } from '../../common/index.js';
import { IConfigProps, IConfigPropsParameters, IForm, IModelData} from '../../interfaces/index.js';
import { Form, ModelData } from '../index.js';

export class ConfigProps implements IConfigProps {

  constructor(_config: IConfigPropsParameters) {
    let { name, dependent: active, schemaObj, schemaOptions, postPutMiddlewares } = _config;

    // basic validation
    if (!name || !schemaObj) {
      throw new Error(`ConfigProps class constructor is missing requird properties => ${_config}`);
    }

    if (Svc.db.exist(name.toLowerCase())) {
      throw new Error(`ConfigProps basic schema validation faild ! name property : ${name} already on db.`);
    }


    this.name = name.toLowerCase(),
      this.dependent = active || false,
      this.schemaObj = schemaObj || {},
      this.schemaOptions = { timestamps: true, strict: true, ...schemaOptions }

    this.modelData = new ModelData(_config);
    this.postPutMiddlewares = this.removeDiplicates(postPutMiddlewares)
  }

  name: string
  dependent: Boolean
  modelData : IModelData
  schemaObj: object
  schemaOptions?: Record<string, any>
  postPutMiddlewares: string[] // used for post put actions
  formCache?: IForm

  private removeDiplicates(arr?: any[]) {
    // Set will remove diblicate
    return (arr && Array.isArray(arr)) ? Array.from(new Set(arr)) : []
  }
  getProps(): IConfigProps {
    return {
      name: this.name,
      dependent: this.dependent,
      schemaObj: this.schemaObj,
      schemaOptions: this.schemaOptions,
      modelData: this.modelData,
      postPutMiddlewares: this.postPutMiddlewares
    }
  }

  getRoutes() {
    return Svc.routes.getRoutesPathMethods(this.modelData.routeName)
  }

  async genForm(): Promise<IForm> {
    if (this.formCache)
      return this.formCache;

    let _form = new Form(this);
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
    return this.modelData.useAuth.indexOf(actionName) !== -1
  }
  inAdmin(actionName: string): boolean {
    return this.modelData.useAdmin.indexOf(actionName) !== -1
  }
}
