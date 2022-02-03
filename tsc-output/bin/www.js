#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = (0, tslib_1.__importDefault)(require("../app"));
var debug = require('debug')('Express-Api-Server:server');
const http_1 = (0, tslib_1.__importDefault)(require("http"));
const https_1 = (0, tslib_1.__importDefault)(require("https"));
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
var server = configure_server(false);
function configure_server(isHttps = false) {
    var server;
    var port = isHttps ? normalizePort(process.env.PORT || '443') : normalizePort(process.env.PORT || '3000');
    process.env.PORT = port;
    if (isHttps) {
        app_1.default.set('secPort', port);
        var options = {
            key: fs_1.default.readFileSync(__dirname + '/private.key'),
            cert: fs_1.default.readFileSync(__dirname + '/certificate.pem')
        };
        server = https_1.default.createServer(options, app_1.default);
    }
    else {
        app_1.default.set('port', port);
        server = http_1.default.createServer(app_1.default);
    }
    server.listen(port, () => {
        console.log("express-api-server is listening on :" + port);
    });
    server.on('error', onError);
    server.on('listening', onListening);
    return server;
}
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
    let port = process.env.PORT;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3d3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jpbi93d3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLDhEQUF5QjtBQUN6QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUMxRCw2REFBd0I7QUFDeEIsK0RBQTBCO0FBQzFCLHlEQUFvQjtBQUVwQixJQUFJLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQyxTQUFTLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxLQUFLO0lBQ3ZDLElBQUksTUFBVyxDQUFDO0lBQ2hCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUM7SUFDMUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLElBQUksT0FBTyxFQUFDO1FBQ2IsYUFBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsSUFBSSxPQUFPLEdBQUc7WUFDYixHQUFHLEVBQUUsWUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUMsY0FBYyxDQUFDO1lBQzlDLElBQUksRUFBRSxZQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBQyxrQkFBa0IsQ0FBQztTQUNuRCxDQUFDO1FBQ0QsTUFBTSxHQUFHLGVBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFDLGFBQUcsQ0FBQyxDQUFDO0tBQzFDO1NBQUk7UUFFSCxhQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QixNQUFNLEdBQUcsY0FBSSxDQUFDLFlBQVksQ0FBQyxhQUFHLENBQUMsQ0FBQztLQUVoQztJQUdELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxHQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFHcEMsT0FBTyxNQUFNLENBQUM7QUFDZCxDQUFDO0FBQUEsQ0FBQztBQUdGLFNBQVMsYUFBYSxDQUFDLEdBQU87SUFDNUIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU3QixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNmLGFBQWE7UUFDYixPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRUQsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO1FBQ2IsY0FBYztRQUNkLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFHRCxTQUFTLE9BQU8sQ0FBQyxLQUFTO0lBQ3hCLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDOUIsTUFBTSxLQUFLLENBQUM7S0FDYjtJQUNELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFBO0lBQzNCLElBQUksSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVE7UUFDakMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJO1FBQ2hCLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBRW5CLHVEQUF1RDtJQUN2RCxRQUFRLEtBQUssQ0FBQyxJQUFJLEVBQUU7UUFDbEIsS0FBSyxRQUFRO1lBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsK0JBQStCLENBQUMsQ0FBQztZQUN0RCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLEtBQUssWUFBWTtZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLENBQUM7WUFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQjtZQUNFLE1BQU0sS0FBSyxDQUFDO0tBQ2Y7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFFSCxTQUFTLFdBQVc7SUFDbEIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzVCLElBQUksSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVE7UUFDakMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJO1FBQ2hCLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUN0QixLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ2xDLENBQUMifQ==