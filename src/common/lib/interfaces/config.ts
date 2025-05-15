import { IPager ,IRouteData} from "./common.js";
import { IEndPoint } from "./endpoint.js";


export interface IConfigParameters extends IPager {
  name: string;
  routeName?: string;
  paramId?: string;
  tags?: string[];
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
  modelTemplates?: Record<string, string>;
}

export interface IConfigration extends IRouteData {
  _id: string;
  disableRoutes: boolean;
  isArchieved: boolean;
  endPoints: IEndPoint[];
  schemaObj: Record<string, any>;
  schemaOptions: Map<string, any>;
  recaptcha?: object;
  tags: string[];
  disabledActions: string[];
  queryKey?: string;
  textSearch?: string[];
  modelTemplates?: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
