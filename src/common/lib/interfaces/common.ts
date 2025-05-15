import { Model, SortOrder } from 'mongoose';
import { Response } from 'express';
import { IMongooseTypes } from './types.js';

export interface IPager {
  limit?: number;
  orderby?: string;
  sort?: SortOrder;
}

export interface IRouteData extends Required<IPager> {
  name: string
  routeName: string
  paramId: string
  authorize:Map<string,boolean>
}
export interface IViewData {
  queryKey?: string
 // metaData: IMetaData
  tags:string[]
  textSearch?: string[]
  modelTemplates?: Record<string,string>
}
export interface IPropertyInfo {
  name: string
  schemaType: IMongooseTypes
  displayName?: string
  tagName: string
  attributes?: Record<string, any>
}
export interface IRequestFilter extends Required<IPager> {
  filter: Record<string, any>;
  page: number;
  total: boolean;
}

export interface Iresponces {
  errObjInfo: (err: any, obj: any, info: any) => void;
  success: (msg?: string) => void;
  fail: (msg?: string) => void;
  errStatus: (status: number, msg: string) => void;
  badRequest: (msg?: string) => void;
  forbidden: (msg?: string) => void;
  unAuthorized: (msg?: string) => void;
  notFound: (msg?: string) => void;
  error: (err: any) => void;
  data: (item: any, message?: string, total?: number) => void;
  errCb: (err: any, cb: Function) => void;
  errSuccess: (err: any) => void;
  callback: (cb: Function, obj?: any) => void;
  json: (obj: object) => void;
  ok: () => void;
}


export interface asyncCallback {
  (db:Model<any>): Promise<any>
}
export interface IRequestResponce {
  (res: Response, cb?: Function): Iresponces;
}

export interface IActiveRoutes {
  get: string[];
  post: string[];
  put: string[];
  delete: string[];
  options: string[];
}

// Common sort/pagination options
export interface IPager {
  limit?: number;
  orderby?: string;
  sort?: SortOrder;
}

// Required request filter based on pager
export interface IRequestFilter extends Required<IPager> {
  filter: Record<string, any>;
  page: number;
  total: boolean;
}
export interface IActiveRoutes {
  get: string[];
  post: string[];
  put: string[];
  delete: string[];
  options: string[];
}