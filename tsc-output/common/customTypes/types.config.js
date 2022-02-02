"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendController = exports.createInstance = exports.getProperty = exports.getCont = exports.getSvc = exports.extendedInstance = exports.routeStore = exports.modelStore = exports.SvcStore = exports.dbStore = exports.returnJson = void 0;
function returnJson(obj, status, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(obj);
}
exports.returnJson = returnJson;
;
;
// db object
exports.dbStore = {};
// model object
exports.SvcStore = {};
exports.modelStore = {};
// routesDb
exports.routeStore = {};
function extendedInstance(arg, c) {
    return new c(...arg);
}
exports.extendedInstance = extendedInstance;
function getSvc(url) {
    for (let d in exports.SvcStore) {
        if (d !== '/' && url.match(d.toLowerCase())) {
            return exports.SvcStore[d];
        }
    }
    throw new Error('service not found for arg :' + name);
}
exports.getSvc = getSvc;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1vbi9jdXN0b21UeXBlcy90eXBlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBTUEsU0FBZ0IsVUFBVSxDQUFFLEdBQVMsRUFBQyxNQUFhLEVBQUUsR0FBUTtJQUMzRCxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzVCLENBQUM7QUFISCxnQ0FHRztBQUFBLENBQUM7QUFDMEQsQ0FBQztBQVEvRCxZQUFZO0FBQ0MsUUFBQSxPQUFPLEdBQStCLEVBQUUsQ0FBQztBQUN0RCxlQUFlO0FBQ0YsUUFBQSxRQUFRLEdBQWUsRUFBRSxDQUFDO0FBQzVCLFFBQUEsVUFBVSxHQUFpQixFQUFFLENBQUM7QUFDekMsV0FBVztBQUNFLFFBQUEsVUFBVSxHQUE4QixFQUFFLENBQUM7QUFFeEQsU0FBZ0IsZ0JBQWdCLENBQThCLEdBQVMsRUFBRSxDQUEwQjtJQUNqRyxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUZELDRDQUVDO0FBRUQsU0FBaUIsTUFBTSxDQUFDLEdBQVU7SUFDN0IsS0FBSSxJQUFJLENBQUMsSUFBSSxnQkFBUSxFQUFDO1FBQ3JCLElBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFDO1lBQzNDLE9BQU8sZ0JBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQjtLQUNGO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsR0FBRSxJQUFJLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBUEQsd0JBT0M7QUFFRCxTQUFpQixPQUFPLENBQUMsR0FBVTtJQUMvQixLQUFJLElBQUksQ0FBQyxJQUFJLGtCQUFVLEVBQUM7UUFDdEIsSUFBRyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFDO1lBQ3hELDZDQUE2QztZQUM1QyxPQUFPLGtCQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1NBQ2pDO0tBQ0Y7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxHQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFSRCwwQkFRQztBQUVELFNBQWdCLFdBQVcsQ0FBK0IsR0FBUyxFQUFFLEdBQVE7SUFDekUsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQUZELGtDQUVDO0FBRUQsU0FBZ0IsY0FBYyxDQUFJLFdBQW9DLEVBQUUsR0FBRyxJQUFXO0lBQ2xGLE9BQU8sSUFBSSxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRkgsd0NBRUc7QUFFSCxTQUFnQixnQkFBZ0IsQ0FBd0IsSUFBcUIsRUFBRSxHQUFHLEdBQVM7SUFDdEYsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFGRiw0Q0FFRSJ9