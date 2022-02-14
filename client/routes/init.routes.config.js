"use strict";
const  {initCustomRoutes} = require('../../corejs/routes/init.routes.config');
const path = require('path');
const { appRouter} = require('../../corejs/common/customTypes/types.config');

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

exports.initClientRoutes = async ()=>{
 return await  initCustomRoutes(IndexRoutes)
}