"use strict";
const path = require('path');
const { initRouteStore} = require('../../src/javascript/routes');

function IndexRoutes(app) {
    let index = {
      '/':'../../public/coming_soon/index.html',
      '/angular':'../../public/angular/index.html',
      'reactjs':'../../public/reactjs/index.html'
    }
  
    for (const [key, value] of Object.entries(index)) {
      app.get(key, (req, res, next) => res.status(200).sendFile(path.join(__dirname, value)));
    }
  }

exports.IndexRoutes = IndexRoutes;

initRouteStore.push(IndexRoutes)
