"use strict";
const Cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200', 
'http://tuban.me', 'http://static.tuban.me', 'http://test.tuban.me', 'http://mobile.tuban.me',
'https://tuban.me', 'https://static.tuban.me', 'https://test.tuban.me', 'https://mobile.tuban.me'];

var corsOptionsDelegate = (req, callback)=> {
    var corsOptions;
   // console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.corss = Cors();
exports.corsWithOptions = Cors(corsOptionsDelegate);