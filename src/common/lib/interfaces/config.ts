import { SortOrder } from "mongoose";
import { IEndPoint } from "./endpoint.js";

export interface IPager {
  limit?: number;
  orderby?: string;
  sort?: SortOrder;
}

export interface IRouteData extends Required<IPager> {
  name: string
  routeName: string
  paramId: string
  disableRoutes: boolean;
  accessRoles?: string[];
  authorize:Map<string,boolean> // ationName, requireRBAC
}


export interface IConfigParameters extends IPager {
  name: string;
  routeName?: string;
  paramId?: string;
  tags?: string[];
  accessRoles?: string[];
  disabledActions?: string[];
  queryKey?: string;
  disableRoutes?: boolean;
  isArchieved?: boolean;
  schemaObj: object;
  schemaOptions?: Record<string, any>;
  recaptcha?: object;
  authorize?: Record<string, boolean>;
  endPoints?: IEndPoint[];
  textSearch?: string[];
  templates?: Record<string, string>;
}

export interface IConfigration extends IRouteData {
  _id: string;
  isArchieved: boolean;
  endPoints: IEndPoint[];
  schemaObj: Record<string, any>;
  schemaOptions: Map<string, any>;
  recaptcha?: object;
  tags: string[];
  disabledActions: string[];
  queryKey?: string;
  textSearch: string[];
  templates: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
