#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menServer = void 0;
const tslib_1 = require("tslib");
//import express from 'express';
//import  debug from 'debug';
//debug('Express-Api-Server:server');
const http_1 = tslib_1.__importDefault(require("http"));
const https_1 = tslib_1.__importDefault(require("https"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const getCert = (certName) => path_1.default.join(__dirname, certName);
async function menServer(app, isHttps = false) {
    var server;
    var port = isHttps ? normalizePort(process.env['PORT'] || '443') : normalizePort(process.env['PORT'] || '3000');
    process.env['PORT'] = port;
    if (isHttps) {
        app.set('secPort', port);
        var options = {
            key: fs_1.default.readFileSync(getCert('private.key')),
            cert: fs_1.default.readFileSync(getCert('certificate.pem'))
        };
        server = https_1.default.createServer(options, app);
    }
    else {
        app.set('port', port);
        server = http_1.default.createServer(app);
    }
    server.listen(port, () => console.log(`dmens ${app.get('env')} server is listening on port: ${port}`));
    server.on('error', onError);
    //server.on('listening', onListening);
    return server;
}
exports.menServer = menServer;
;
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    let port = process.env['PORT'];
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
/*
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
*/ 
