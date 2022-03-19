"use strict";
const  {appRouter} = require('../../src/javascript/common');
const path = require('path');
const { initRouteStore} = require('../../src/javascript/routes');

function IndexRoutes() {
    let index = {
      '/':'../../public/coming_soon/index.html',
      '/angular':'../../public/angular/index.html',
      'reactjs':'../../public/reactjs/index.html'
    }
  
    for (const [key, value] of Object.entries(index)) {
      appRouter.get(key, (req, res, next) => res.status(200).sendFile(path.join(__dirname, value)));
    }
  }

exports.IndexRoutes = IndexRoutes;

initRouteStore.push(IndexRoutes)
