"use strict";
import path from 'path';
import { fileURLToPath } from 'url';
import  {initRouteStore} from '../../dmens/routes/index.js';

const __dirname =path.dirname(fileURLToPath(import.meta.url));

export default function IndexRoutes(app) {
  /*
    let index = {
      '/':'../../public/index.html',
      '/coming_soon':'../../public/coming_soon/index.html',
      '/angular':'../../public/angular/index.html',
      '/reactjs':'../../public/reactjs/index.html'
    }
  
    for (const [key, value] of Object.entries(index)) {
      app.get(key, (req, res, next) => res.status(200).sendFile(path.join(__dirname, value)));
    }
    */
  }


initRouteStore.push(IndexRoutes)
