import { Request, Response, NextFunction } from "express";
import mongoose, { sanitizeFilter } from 'mongoose';
import {
  responces, appData, removeItemsFromObject,
  IEndPointRoute, IConfigration, IController,
  IRequestFilter, IRequestVerpsAsync,
  IModel
} from '../../common/index.js';

import fetch from 'node-fetch';


export class DefaultController implements IController {

  config: IConfigration
  db: IModel
  constructor(config: IConfigration, ) {

    if (!config) {
      throw new Error('Defaultcontroller require config instance ')
    }
    this.config = config;
    this.db = mongoose.model<IConfigration, IModel>(config.name);

  }


  endPoint(host: string, route: IEndPointRoute): IRequestVerpsAsync {
    // console.log('reached http client====================================>\n',host,route);
    let { method, path, passAuth, paramId, headers } = route;

    let url = new URL((path ? host + path + (paramId ?? "") : host));

    headers = { ...headers, "Content-Type": "application/json" };

    let build: any = { method, headers };

    return async (req: Request, res: Response, next: NextFunction) => {
      //console.log('reached http client====================================>\n',req.method,req.query);

      if (req.query) {
        for (let [key, value] of Object.entries(req.query)) {
          url.searchParams.append(key, value as string)
        }
      }
      if (passAuth && req.headers.authorization) {
        headers!['Authorization'] = req.headers.authorization;
      }


      if (method !== 'get')
        build.body = req.body;

      let responce = await fetch(url, build);
      let data = await responce.json();
      return responces.data(res, data)
    }
  }
  buildQuery(query: Record<string, any>): IRequestFilter {
    let con = this.config;
    if (query) {
      let queries: Record<string, any> = sanitizeFilter(query);
      let { page, pagesize, orderby, sortorder, total } = queries;
      pagesize ??= con.pagesize;
      page ??= 1;
      orderby ??= con.orderby;
      sortorder ??= con.sortorder;
      total ??= false;

      // clean filter
      removeItemsFromObject(queries, ['page', 'size', 'sortorder', 'orderby', 'total']);

      return { filter: queries, page, pagesize, orderby, sortorder, total };
    } else {
      let { pagesize, orderby, sortorder } = con;
      return { filter: {}, pagesize, page: 1, orderby, sortorder, total: false }
    }
  }

  async count(req: Request, res: Response, next: NextFunction) {
    let num = await this.db.countDocuments(sanitizeFilter(req.query))
    responces.data(res, num!)
  }

  async search(req: Request, res: Response, next: NextFunction) {

    if (!req.query) {
      return responces.data(res, []);
    }

    let query = this.buildQuery!(req.query)!;

    // text search only
    if (query.filter['text']) {

      query.filter = { $text: { $search: query.filter['text'] } };

      let items = await this.db.toList(query);

      return responces.data(res, items!);

    } else {
      // //While not a full text search, for partial matching, regular expressions can be used
      let searchKeys = Object.keys(query.filter).map((key) => [[key], new RegExp(`${query.filter[key]}`, 'i')]);
      query.filter = Object.fromEntries(searchKeys);
      let items = await this.db.toList(query);
      return responces.data(res, items!);

    }
  }

  async list(req: Request, res: Response, next: NextFunction) {

    let query = this.buildQuery!(req.query)!;

    let items = await this.db.toList(query);

    let total = query.total ? await this.db.countDocuments(query.filter) : undefined;

    return responces.data(res, items, total)
  }

  async get(req: Request, res: Response, next: NextFunction) {

    if (req.params) {
      let _id = req.params[this.config.paramId!];
      if (_id) {
        let item = await this.db.findById(_id);
        responces.data(res, item);
        return;
      } else {
        let item = await this.db.findById(req.params);
        responces.data(res, item)
        return;
      }

    } else if (req.query) {

      let item = await this.db.findOne(sanitizeFilter(req.query));
      return responces.data(res, item)
    } else {
      return responces.badRequest(res)
    }

  }
  async create(req: Request, res: Response, next: NextFunction) {
    let item = await this.db.create(req.body);
    console.log('document Created :', item);
    responces.data(res, item)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    let _id = req.params[this.config.paramId!];
        if(_id && await this.db.exists({_id})){
        let data=   await this.db.findByIdAndUpdate(_id,req.body);
        responces.data(res,data);
        }
        
        // let result = await Operations.overrideModelConfigRoute({ ...config, ...req.body });
        //envs.logLine('document created or Overrided :', result.controller?.db.name);
       return responces.notFound(res);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    let item = await this.db.findByIdAndDelete(req.params[this.config.paramId]);
    console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`)
    responces.success(res)
  }

  async test(req: Request, res: Response, next: NextFunction) {
    console.log('this test method =======================>>>')
    responces.data(res, req.user)
  }

}
