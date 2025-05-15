import { IRoute, Request, Response, NextFunction, IRouter } from 'express';
import { Model, SortOrder, HydratedDocument, Schema, ClientSession } from 'mongoose';


export type IDefaultActions =
  | 'list' | 'get' | 'post' | 'put' | 'delete'
  | 'search' | 'count' | 'metadata'
  | 'route' | 'viewdata' | 'routedata' | 'deleteRoute';

export type MakeRequired<T> = {
  [K in keyof T]-?: T[K];
};

export type IMethod = 'get' | 'post' | 'put' | 'delete' | 'options';

export interface IConstructor<T> {
  new (...args: any[]): T;
}

export type IRequestVerpsAsync = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export type IRequestVerps = (req: Request, res: Response, next: NextFunction) => any;

export type IMongooseTypes =
  "String" |
  "Number" |
  "BigInt" |
  "Date" |
  "Binary" |
  "Boolean" |
  "Mixed" |
  "ObjectId" |
  "Array" |
  "DocumentArray" |
  "Decimal" |
  "Map";



