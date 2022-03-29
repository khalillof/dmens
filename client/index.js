"use strict";
const path = require('path');
const envpath = path.resolve(__dirname,'./.env');
const {mens} = require('../src/javascript');
const  {IndexRoutes} = require('./routes/init.routes.config');

mens();

  
