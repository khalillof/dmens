"use strict";

const {app} = require('../corejs/app');
const  {initClientRoutes} = require('./routes/init.routes.config');

setTimeout(async()=>{
 await initClientRoutes()
  }, 500)
  
require('../corejs/bin/www').server