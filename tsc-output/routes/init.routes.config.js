"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRoutes = void 0;
const tslib_1 = require("tslib");
const index_routes_config_1 = require("./index.routes.config");
const users_routes_config_1 = require("./users.routes.config");
const auth_routes_config_1 = require("./auth.routes.config");
const default_routes_config_1 = require("./default.routes.config");
function initializeRoutes(app) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        yield default_routes_config_1.DefaultRoutesConfig.createInstancesWithDefault(app, ['/dishes', '/leaders', '/favorites', '/promotions']);
        yield (0, index_routes_config_1.IndexRoutes)(app);
        yield (0, auth_routes_config_1.AuthRoutes)(app);
        yield (0, users_routes_config_1.UsersRoutes)(app);
        return yield Promise.resolve(availableRoutesToString(app));
    });
}
exports.initializeRoutes = initializeRoutes;
// helpers
function availableRoutesToString(app) {
    let result = app._router.stack
        .filter((r) => r.route)
        .map((r) => Object.keys(r.route.methods)[0].toUpperCase().padEnd(7) + r.route.path)
        .join("\n");
    console.log('================= All Routes avaliable ================ \n' + result);
}
function availableRoutesToJson(app) {
    let result = app._router.stack
        .filter((r) => r.route)
        .map((r) => {
        return {
            method: Object.keys(r.route.methods)[0].toUpperCase(),
            path: r.route.path
        };
    });
    console.log('================= All Routes avaliable ================ \n' + JSON.stringify(result, null, 2));
    //console.log(JSON.stringify(result, null, 2));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5yb3V0ZXMuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vcHVyZXRzL3JvdXRlcy9pbml0LnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLCtEQUFrRDtBQUNsRCwrREFBa0Q7QUFDbEQsNkRBQWdEO0FBRWhELG1FQUE0RDtBQUUxRCxTQUFzQixnQkFBZ0IsQ0FBQyxHQUF3Qjs7UUFFOUQsTUFBTSwyQ0FBbUIsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQy9HLE1BQU0sSUFBQSxpQ0FBVyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sSUFBQSwrQkFBVSxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sSUFBQSxpQ0FBVyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXhCLE9BQU8sTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDMUQsQ0FBQztDQUFBO0FBUkQsNENBUUM7QUFFRCxVQUFVO0FBQ1YsU0FBUyx1QkFBdUIsQ0FBQyxHQUF1QjtJQUN0RCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUs7U0FDM0IsTUFBTSxDQUFDLENBQUMsQ0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztTQUN0RixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFWixPQUFPLENBQUMsR0FBRyxDQUFDLDREQUE0RCxHQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3JGLENBQUM7QUFDRCxTQUFTLHFCQUFxQixDQUFDLEdBQXVCO0lBQ3BELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSztTQUN6QixNQUFNLENBQUMsQ0FBQyxDQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDMUIsR0FBRyxDQUFDLENBQUMsQ0FBSyxFQUFFLEVBQUU7UUFDZixPQUFPO1lBQ0gsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7WUFDckQsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSTtTQUNyQixDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLDREQUE0RCxHQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzFHLCtDQUErQztBQUNqRCxDQUFDIn0=