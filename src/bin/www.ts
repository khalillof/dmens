#!/usr/bin/env node
//import express from 'express';
//import  debug from 'debug';
//debug('Express-Api-Server:server');
import http from 'node:http';
import https from 'node:https';
import fs from 'fs';
import path from 'path';

const getCert =(certName:string) => path.join(__dirname, certName);

export async function menServer(app:any,isHttps = false){
 
  var server: any;
  var port = isHttps ? normalizePort(process.env['PORT'] || '443') : normalizePort(process.env['PORT'] || '3000');
  process.env['PORT'] = port;
  if (isHttps){
 app.set('secPort',port); 
 var options = {
  key: fs.readFileSync(getCert('private.key')),
  cert: fs.readFileSync(getCert('certificate.pem'))
 };
  server = https.createServer(options,app);
}else{

  app.set('port', port);
  server = http.createServer(app);

 }


 server.listen(port, ()=> console.log(`dmens ${app.get('env')} server is listening on port: ${port}`));
server.on('error', onError);
//server.on('listening', onListening);


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
  let port = process.env['PORT']
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