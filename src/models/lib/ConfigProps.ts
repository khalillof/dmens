"use strict";
import { dbStore } from '../../common/index.js';
import { IConfigProps, IConfigPropsParameters } from '../../interfaces/index.js';

export class ConfigProps implements IConfigProps {

  constructor(_config: IConfigPropsParameters) {

    // basic validation
    if (!_config || !_config.name || !_config.schemaObj) {
      throw new Error(`ConfigProps class constructor is missing requird properties => ${_config}`);
    }

    if (dbStore[_config.name.toLowerCase()]) {
      throw new Error(`ConfigProps basic schema validation faild ! name property : ${_config.name} already on db.`);
    }


    this.name = _config.name.toLowerCase();
    this.active = _config.active || false;

    this.useAuth = _config.useAuth || [];
    this.useAdmin = _config.useAdmin || [];
    this.schemaObj = _config.schemaObj || {};
    this.schemaOptions = { timestamps: true, strict:true, ..._config.schemaOptions };
    // validate schema
    // this.validateSchema()
  }

   name: string 
   active: Boolean
   useAuth: String[]
   useAdmin: String[]
   schemaObj: object
   schemaOptions: Record<string,any>

   getConfigProps(): IConfigProps {
    return {
      name: this.name,
      active: this.active,
      useAdmin: this.useAdmin,
      useAuth: this.useAuth,
      schemaObj: this.schemaObj,
      schemaOptions:this.schemaOptions
    }
  }
    setConfigProps(props:IConfigProps): void {
    this.name = props.name;
    this.active = props.active;
    this.useAdmin = props.useAdmin;
    this.useAuth = props.useAuth;
    this.schemaObj = props.schemaObj;
    (this.schemaOptions && props.schemaOptions) && (this.schemaOptions = props.schemaOptions);
  }
}
