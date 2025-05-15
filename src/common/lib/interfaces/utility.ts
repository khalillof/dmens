import { ClientSession } from "mongoose";
import { IModel } from "./model.js";

export interface IExecWithSessionCallback {
  (this: IModel, session: ClientSession): Promise<any>;
}

export interface ICleanExecWithSessionCallback {
  (this: IModel): Promise<any>;
}

export interface IExecWithSessionAsync {
  (this: IModel, callback: IExecWithSessionCallback, cleanJob?: ICleanExecWithSessionCallback): Promise<any>;
}

//export interface IConstructor<T> {
//  new (...args: any[]): T;
//}

