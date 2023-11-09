"use strict";
import { Svc } from '../../common/index.js';
import { IConfigPropsParameters, IRouteData } from '../../interfaces/index.js';


export class RouteData implements IRouteData {
  constructor(_config: IConfigPropsParameters) {
    let { name, routeName, useAuth, useAdmin, displayName, searchKey, 
      pagesPerPage, queryName, paramId, useComment, uselikes } = _config;
        if(!name){
          throw new Error('name is required propery')
        }
        
    this.modelName = name.toLowerCase(),
    this.routeName = (routeName && routeName.replace('/', '').toLowerCase()) || Svc.routes.pluralizeRoute(name);
    this.baseRoutePath = '/' + this.routeName;
    this.paramId = paramId || this.modelName + 'Id';
    this.routeParam = this.baseRoutePath + '/:' + this.paramId;
    this.useAuth = this.removeDiplicates(useAuth),
    this.useAdmin = this.removeDiplicates(useAdmin);
    this.displayName = displayName || this.modelName;
    this.useComment = useComment || false;
    this.uselikes = uselikes || false; 

    if (queryName)
      this.queryName = queryName;

    if (searchKey)
      this.searchKey = searchKey;

    this.pagesPerPage = pagesPerPage || 5;

    let isIn = (action: string) => [this.useAdmin.indexOf(action) !== -1, this.useAuth.indexOf(action) !== -1];

    this.listAuth = isIn('list');
    this.getAuth = isIn('get');
    this.postAuth = isIn('post');
    this.putAuth = isIn('put');
    this.deleteAuth = isIn('delete');
    this.searchAuth = isIn('search')

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
  uselikes: boolean 

  listAuth: boolean[]
  getAuth: boolean[]
  postAuth: boolean[]
  putAuth: boolean[]
  deleteAuth : boolean[]
  searchAuth: boolean[]

  private removeDiplicates(arr?: any[]) {
    // Set will remove diblicate
    return (arr && Array.isArray(arr)) ? Array.from(new Set(arr)) : [];
  }

}
