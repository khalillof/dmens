"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendController = exports.createInstance = exports.getProperty = exports.getCont = exports.getDb = exports.extendedInstance = exports.routeStore = exports.dbStore = exports.returnJson = void 0;
const tslib_1 = require("tslib");
function returnJson(obj, status, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(obj);
}
exports.returnJson = returnJson;
;
;
// db object
exports.dbStore = {};
// routesDb
exports.routeStore = {};
function extendedInstance(arg, c) {
    return new c(...arg);
}
exports.extendedInstance = extendedInstance;
function getDb(url) {
    for (let d in exports.dbStore) {
        if (d !== '/' && url.match(d.toLowerCase())) {
            return exports.dbStore[d];
        }
    }
    throw new Error('service not found for arg :' + name);
}
exports.getDb = getDb;
function getCont(url) {
    for (let d in exports.routeStore) {
        if (d !== '/' && url.match(d) || d === '/' && url === d) {
            // console.log('from getcon : '+url +' - '+d)
            return exports.routeStore[d].controller;
        }
    }
    throw new Error('controller not found for the url :' + url);
}
exports.getCont = getCont;
function getProperty(obj, key) {
    return obj[key];
}
exports.getProperty = getProperty;
function createInstance(constructor, ...args) {
    return new constructor(...args);
}
exports.createInstance = createInstance;
function extendController(type, ...arg) {
    return new type(...arg);
}
exports.extendController = extendController;
function activator(type, ...arg) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        // if(arg)
        return yield Promise.resolve(new type(...arg));
        // usage:
        // const classcc = activator(ClassA);
        //const classee = activator(ClassA, ['']);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHVyZXRzL2NvbW1vbi9jdXN0b21UeXBlcy90eXBlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQU1BLFNBQWdCLFVBQVUsQ0FBRSxHQUFTLEVBQUMsTUFBYSxFQUFFLEdBQVE7SUFDM0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUM1QixDQUFDO0FBSEgsZ0NBR0c7QUFBQSxDQUFDO0FBRTBELENBQUM7QUFTL0QsWUFBWTtBQUNDLFFBQUEsT0FBTyxHQUErQixFQUFFLENBQUM7QUFFdEQsV0FBVztBQUNFLFFBQUEsVUFBVSxHQUE4QixFQUFFLENBQUM7QUFFeEQsU0FBZ0IsZ0JBQWdCLENBQThCLEdBQVMsRUFBRSxDQUEwQjtJQUNqRyxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUZELDRDQUVDO0FBRUQsU0FBaUIsS0FBSyxDQUFDLEdBQVU7SUFDL0IsS0FBSSxJQUFJLENBQUMsSUFBSSxlQUFPLEVBQUM7UUFDcEIsSUFBRyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUM7WUFDM0MsT0FBTyxlQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7S0FDRDtJQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEdBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsQ0FBQztBQVBELHNCQU9DO0FBQ0QsU0FBaUIsT0FBTyxDQUFDLEdBQVU7SUFDL0IsS0FBSSxJQUFJLENBQUMsSUFBSSxrQkFBVSxFQUFDO1FBQ3RCLElBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsRUFBQztZQUN4RCw2Q0FBNkM7WUFDNUMsT0FBTyxrQkFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztTQUNqQztLQUNGO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsR0FBRSxHQUFHLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBUkQsMEJBUUM7QUFFRCxTQUFnQixXQUFXLENBQStCLEdBQVMsRUFBRSxHQUFRO0lBQ3pFLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFGRCxrQ0FFQztBQUVELFNBQWdCLGNBQWMsQ0FBSSxXQUFvQyxFQUFFLEdBQUcsSUFBVztJQUNsRixPQUFPLElBQUksV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUZILHdDQUVHO0FBRUgsU0FBZ0IsZ0JBQWdCLENBQXdCLElBQXFCLEVBQUUsR0FBRyxHQUFTO0lBQ3RGLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRkYsNENBRUU7QUFhRixTQUFlLFNBQVMsQ0FBZ0IsSUFBcUIsRUFBRSxHQUFHLEdBQVM7O1FBQ3pFLFVBQVU7UUFDVCxPQUFPLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsU0FBUztRQUNWLHFDQUFxQztRQUNyQywwQ0FBMEM7SUFDNUMsQ0FBQztDQUFBIn0=