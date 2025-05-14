"use strict";
import { IPropertyInfo, IMongooseTypes } from "../../common/index.js";



export class PropertyInfo implements IPropertyInfo {
  constructor(info: PropertyInfo) {
    let { name, schemaType, displayName, tagName, attributes } = info;
    this.name = name;
    this.schemaType = schemaType;
    this.displayName = displayName;
    this.tagName = tagName;
    this.attributes = attributes;
  }
  name: string;
  schemaType: IMongooseTypes;
  displayName?: string;
  tagName: string;
  attributes?: Record<string, any>;
}
