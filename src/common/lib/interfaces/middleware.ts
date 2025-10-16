import { IRequestVerpsAsync, IRequestVerps } from "./types.js";

export interface IMiddlewares {
  //authorize: IRequestVerpsAsync;
  uploadSchema: IRequestVerps;
  isAuthenticated: IRequestVerps;
  isJson: IRequestVerps;
  isInRole(roleName: string): IRequestVerpsAsync;
  isAdmin: IRequestVerps;
}

export interface Iauthenticate {
  (type?: 'jwt' | 'local', opts?: any): IRequestVerpsAsync;
}
