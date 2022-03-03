"use strict";
const Cors = require('cors');
const {config} = require('../../bin/config');

const corsOptions = (req, callback)=> callback(null, {origin: config.cores_domains.indexOf(req.header('Origin')) !== -1 ? true:false});

exports.cors = Cors();
exports.corsWithOptions = Cors(corsOptions);