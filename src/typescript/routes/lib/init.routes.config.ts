"use strict";
//import express from 'express'
import path from 'path';
import {config} from '../../common/index.js'

export function IndexRoutes(app:any) {
  let index = {
    '/':'../../public/coming_soon/index.html',
    '/angular':'../../public/angular/index.html',
    '/reactjs':'../../public/reactjs/index.html'
  }

  for (const [key, value] of Object.entries(index)) {
    app.get(key, (req:any, res:any, next:any) => res.status(200).sendFile(path.join(config.baseDir, value)));
  }
}
