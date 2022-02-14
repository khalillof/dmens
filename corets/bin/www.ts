#!/usr/bin/env node

import app from '../app';
var debug = require('debug')('Express-Api-Server:server');
import http from 'http';
import https from 'https';
import fs from 'fs';

const server = configure_server(false);
export function configure_server(isHttps = false){
  var server: any;
  var port = isHttps ? normalizePort(process.env.PORT || '443') : normalizePort(process.env.PORT || '3000');
  process.env.PORT = port;
  if (isHttps){
 app.set('secPort',port); 
 var options = {
  key: fs.readFileSync(__dirname+'/private.key'),
  cert: fs.readFileSync(__dirname+'/certificate.pem')
 };
  server = https.createServer(options,app);
}else{

  app.set('port', port);
  server = http.createServer(app);

 }


 server.listen(port, () => {
  console.log("express-api-server is listening on :"+ port);
});
server.on('error', onError);
server.on('listening', onListening);


return server;
};


function normalizePort(val:any) {
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


function onError(error:any) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  let port = process.env.PORT
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

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
