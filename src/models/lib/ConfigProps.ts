"use strict";
import { Svc } from '../../common/index.js';

import { IConfigProps, IConfigPropsParameters } from '../../interfaces/index.js';

export class ConfigProps implements IConfigProps {

  constructor(_config: IConfigPropsParameters) {

    // basic validation
    if (!_config || !_config.name || !_config.schemaObj) {
      throw new Error(`ConfigProps class constructor is missing requird properties => ${_config}`);
    }

    if (Svc.db.exist(_config.name.toLowerCase())) {
      throw new Error(`ConfigProps basic schema validation faild ! name property : ${_config.name} already on db.`);
    }


    this.name = _config.name.toLowerCase();
    this.routeName = _config.routeName || Svc.routes.pluralizeRoute(_config.name);
    this.active = _config.active || false;

    this.useAuth = this.removeDiplicates(_config.useAuth);
    this.useAdmin = this.removeDiplicates(_config.useAdmin);
    this.schemaObj = _config.schemaObj || {};
    this.schemaOptions = { timestamps: true, strict: true, ..._config.schemaOptions };
    // validate schema
    // this.validateSchema()
  }

  name: string
  routeName: string
  active: Boolean
  useAuth: String[]
  useAdmin: String[]
  schemaObj: object
  schemaOptions: Record<string, any>

  private removeDiplicates(arr?: any[]) {
    // Set will remove diblicate
    return (arr && Array.isArray(arr)) ? Array.from(new Set(arr)) : []
  }
  getConfigProps(): IConfigProps {
    return {
      name: this.name,
      routeName: this.routeName,
      active: this.active,
      useAdmin: this.useAdmin,
      useAuth: this.useAuth,
      schemaObj: this.schemaObj,
      schemaOptions: this.schemaOptions
    }
  }
  setConfigProps(props: IConfigProps): void {
    this.name = props.name;
    this.active = props.active;
    this.useAdmin = props.useAdmin;
    this.useAuth = props.useAuth;
    this.schemaObj = props.schemaObj;
    (this.schemaOptions && props.schemaOptions) && (this.schemaOptions = props.schemaOptions);
  }

  //check useAuth and useAdmin
  checkAuth(method: string): Array<boolean> {
    return [(this.useAuth.indexOf(method) !== -1), (this.useAdmin.indexOf(method) !== -1)
    ]
  }
}
