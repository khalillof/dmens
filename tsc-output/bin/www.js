#!/usr/bin/env node
"use strict";
/**
 * Module dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = (0, tslib_1.__importDefault)(require("../app"));
var debug = require('debug')('Express-Api-Server:server');
const http_1 = (0, tslib_1.__importDefault)(require("http"));
const https_1 = (0, tslib_1.__importDefault)(require("https"));
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app_1.default.set('port', port);
app_1.default.set('secPort', port + 443);
/**
 * Create HTTP server.
 */
var server = http_1.default.createServer(app_1.default);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
    console.log("Express-Api-Server is listening on :" + port);
});
server.on('error', onError);
server.on('listening', onListening);
//
/**
 * Create HTTPS server.
 */
var options = {
    key: fs_1.default.readFileSync(__dirname + '/private.key'),
    cert: fs_1.default.readFileSync(__dirname + '/certificate.pem')
};
var secureServer = https_1.default.createServer(options, app_1.default);
/**
 * Listen on provided port, on all network interfaces.
 */
//secureServer.listen(app.get('secPort'), () => {
//  console.log('Server listening on port ',app.get('secPort'));
//});
//secureServer.on('error', onError);
//secureServer.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
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
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
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
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3d3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jpbi93d3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7R0FFRzs7O0FBRUgsOERBQXlCO0FBQ3pCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzFELDZEQUF3QjtBQUN4QiwrREFBMEI7QUFDMUIseURBQW9CO0FBRXBCOztHQUVHO0FBRUgsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDO0FBQ3JELGFBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3RCLGFBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFDLElBQUksR0FBQyxHQUFHLENBQUMsQ0FBQztBQUU1Qjs7R0FFRztBQUVILElBQUksTUFBTSxHQUFHLGNBQUksQ0FBQyxZQUFZLENBQUMsYUFBRyxDQUFDLENBQUM7QUFFcEM7O0dBRUc7QUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsR0FBRSxJQUFJLENBQUMsQ0FBQztBQUM1RCxDQUFDLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVCLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBR3BDLEVBQUU7QUFDRjs7R0FFRztBQUVILElBQUksT0FBTyxHQUFHO0lBQ1osR0FBRyxFQUFFLFlBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFDLGNBQWMsQ0FBQztJQUM5QyxJQUFJLEVBQUUsWUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUMsa0JBQWtCLENBQUM7Q0FDcEQsQ0FBQztBQUVGLElBQUksWUFBWSxHQUFHLGVBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFDLGFBQUcsQ0FBQyxDQUFDO0FBRW5EOztHQUVHO0FBRUgsaURBQWlEO0FBQ2pELGdFQUFnRTtBQUNoRSxLQUFLO0FBQ0wsb0NBQW9DO0FBQ3BDLDRDQUE0QztBQUM1Qzs7R0FFRztBQUVILFNBQVMsYUFBYSxDQUFDLEdBQU87SUFDNUIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU3QixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNmLGFBQWE7UUFDYixPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRUQsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO1FBQ2IsY0FBYztRQUNkLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRDs7R0FFRztBQUVILFNBQVMsT0FBTyxDQUFDLEtBQVM7SUFDeEIsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUM5QixNQUFNLEtBQUssQ0FBQztLQUNiO0lBRUQsSUFBSSxJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUTtRQUNqQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUk7UUFDaEIsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFFbkIsdURBQXVEO0lBQ3ZELFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNsQixLQUFLLFFBQVE7WUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRywrQkFBK0IsQ0FBQyxDQUFDO1lBQ3RELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTTtRQUNSLEtBQUssWUFBWTtZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLENBQUM7WUFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNO1FBQ1I7WUFDRSxNQUFNLEtBQUssQ0FBQztLQUNmO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBRUgsU0FBUyxXQUFXO0lBQ2xCLElBQUksSUFBSSxHQUFPLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQyxJQUFJLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRO1FBQ2pDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSTtRQUNoQixDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDdEIsS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUNsQyxDQUFDIn0=