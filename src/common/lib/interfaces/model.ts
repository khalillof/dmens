import { HydratedDocument, Model, Schema } from "mongoose";
import { IPager, IRequestFilter, IRouteData, IViewData } from "./common.js";
import { IConfigration } from "./config.js";
import { IExecWithSessionAsync } from "./utility.js";

export interface IMetaData {
  properties: Record<string, { instance: string; options: any }>;
  requiredProperties: string[];
}

export interface IModelInstanceMethods {
  getRouteData(): IRouteData;
  getViewData(includeMetadata?: boolean): Promise<IViewData>;
}

export interface IModel extends Model<IConfigration, {}, IModelInstanceMethods> {
  toList(query: IRequestFilter): Promise<HydratedDocument<IConfigration, IModelInstanceMethods>[]>;
  getMetaData(schema?: Schema): Promise<IMetaData>;
  execWithSessionAsync: IExecWithSessionAsync;
}
