"use strict";
import { Svc } from '../../common/index.js';
import { IConfigPropsParameters, IModelData} from '../../interfaces/index.js';

export class ModelData implements IModelData {
  constructor(_config: IConfigPropsParameters) {
    const { name, routeName, useAuth, useAdmin, displayName, searchKey, 
      pagesPerPage, queryName, paramId, useComment, useLikes, mdTemplate } = _config;
        if(!name){
          throw new Error('name is required propery')
        }
        
    this.modelName = name.toLowerCase();
    this.routeName = (routeName && routeName.replace('/', '').toLowerCase()) || Svc.routes.pluralizeRoute(name);
    this.baseRoutePath = '/' + this.routeName;
    this.paramId = paramId || this.modelName + 'Id';
    this.routeParam = this.baseRoutePath + '/:' + this.paramId;
    this.useAuth = this.removeDiplicates(useAuth);
    this.useAdmin = this.removeDiplicates(useAdmin);
    this.displayName = displayName || this.modelName;
    this.useComment = useComment || false;
    this.useLikes = useLikes || false; 
    this.mdTemplate = mdTemplate;

    if (queryName)
      this.queryName = queryName;

    if (searchKey)
      this.searchKey = searchKey;

    this.pagesPerPage = pagesPerPage || 5;

   // let isIn = (action: string) => [this.useAdmin.indexOf(action) !== -1, this.useAuth.indexOf(action) !== -1];

  }
  modelName: string;
  routeName: string;
  baseRoutePath: string;
  routeParam: string;
  paramId: string;
  pagesPerPage: number;
  queryName?: string;
  searchKey?: string;
  displayName: string;
  useAuth: string[];
  useAdmin: string[];
  useComment: boolean
  useLikes: boolean 
  mdTemplate?:string 

  private removeDiplicates(arr?: any[]) {
    // Set will remove diblicate
    return (arr && Array.isArray(arr)) ? Array.from(new Set(arr)) : [];
  }

}
