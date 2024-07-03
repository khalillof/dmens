#!/usr/bin/env node

import http from 'node:http';
import https from 'node:https';
import fs from 'fs';
import path from 'path';

const port = process.env['PORT'] || '3000';

export async function httpServer(app:any){
 
  app.set('port', port);
 const server = http.createServer(app);

 server.listen(port, ()=> console.log(`dmens http ${app.get('env')} server is listening on port: ${port}`));
server.on('error', onError);

return server;
};

// To Do later
export async function httpsServer(app:any){
 
 app.set('secPort',port); 
 let sslkey_dir = process.env['SSLKEY_DIR'];
 let sslcert_dir = process.env['SSLCERT_DIR'];

 if(sslkey_dir && sslcert_dir){
 var options = {
  key: fs.readFileSync( path.join(__dirname, sslkey_dir)),
  cert: fs.readFileSync(path.join(__dirname, sslcert_dir))
 };

const  server = https.createServer(options,app);

 server.listen(port, ()=> console.log(`dmens https ${app.get('env')} server is listening on port: ${port}`));
server.on('error', onError);
return server
 }else{
  throw new Error(" https server require sslkey and sslcert are not found")
 }

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
