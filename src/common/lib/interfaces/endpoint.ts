export interface IEndPointRoute {
  _id?: string;
  method: "get" | "post" | "put" | "delete";
  paramId?: string;
  path?: string;
  passAuth?: boolean;
  authorize?: boolean;
  admin?: boolean;
  headers?: Record<string, string>;
}

export interface IEndPoint {
  _id?: string;
  name: string;
  isActive?: boolean;
  host: string;
  routes: IEndPointRoute[];
}
