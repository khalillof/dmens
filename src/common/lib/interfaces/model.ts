import { HydratedDocument, Model, Schema, SortOrder } from "mongoose";
import { IConfigration, IRouteData} from "./config.js";
import { IExecWithSessionAsync } from "./utility.js";
import { IRequestFilter } from "./common.js";


export interface IMetaData {
  properties: Record<string, { instance: string; options: any }>;
  requiredProperties: string[];
}

export interface IViewData extends IRouteData {
  metaData: IMetaData
  tags: string[];
  disabledActions: string[];
  queryKey?: string;
  textSearch: string[];
  templates?: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IModelInstanceMethods {
  //getRouteData(): IRouteData;
  getViewData(): Promise<IViewData>;
}

export interface IModel extends Model<IConfigration, {}, IModelInstanceMethods> {
  toList(query: IRequestFilter): Promise<HydratedDocument<IConfigration, IModelInstanceMethods>[]>;
  getMetaData(schema?: Schema): Promise<IMetaData>;
  execWithSessionAsync: IExecWithSessionAsync;
}
