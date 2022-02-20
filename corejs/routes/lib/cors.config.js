"use strict";
const Cors = require('cors');
const {env} = require('process');

const whitelist = env.NODE_ENV === 'development'? env.CORES_DMAINS_DEV.split(',') : env.CORES_DMAINS_PROD.split(',');

const corsOptions = (req, callback)=> callback(null, {origin: whitelist.indexOf(req.header('Origin')) !== -1 ? true:false});

exports.cors = Cors();
exports.corsWithOptions = Cors(corsOptions);