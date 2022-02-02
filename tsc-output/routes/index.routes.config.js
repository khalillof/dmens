"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexRoutes = void 0;
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const default_routes_config_1 = require("./default.routes.config");
function IndexRoutes(app) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        return yield default_routes_config_1.DefaultRoutesConfig.instance(app, '/', null, (self) => {
            self.app.get('/', (req, res, next) => {
                res.status(200).sendFile(path_1.default.join(__dirname, '../../public/coming_soon/index.html'));
            });
            self.app.get('/angular', (req, res, next) => {
                res.status(200).sendFile(path_1.default.join(__dirname, '../../public/angular/index.html'));
            });
            self.app.get('/reactjs', (req, res, next) => {
                res.status(200).sendFile(path_1.default.join(__dirname, '../../public/reactjs/index.html'));
            });
            /*
            .post(self.corsWithOption, (req, res, next) => {
                returnJson({message:'operation not supported '},403,res);
            })
            .put(self.corsWithOption,(req, res, next) => {
                returnJson({message:'operation not supported '},403,res);
            })
            .delete(self.corsWithOption, (req, res, next) => {
                returnJson({message:'operation not supported '},403,res);
            });
            */
        });
    });
}
exports.IndexRoutes = IndexRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgucm91dGVzLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvaW5kZXgucm91dGVzLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsNkRBQXdCO0FBR3hCLG1FQUE0RDtBQUU1RCxTQUFzQixXQUFXLENBQUMsR0FBd0I7O1FBQ3RELE9BQU8sTUFBTSwyQ0FBbUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUF3QixFQUFPLEVBQUU7WUFFdkYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQTBCLEVBQUMsRUFBRTtnQkFFeEYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUNBQXFDLENBQUMsQ0FBQyxDQUFDO1lBQzFGLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFDLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQTBCLEVBQUMsRUFBRTtnQkFDL0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsaUNBQWlDLENBQUMsQ0FBQyxDQUFDO1lBQ3RGLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFDLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQTBCLEVBQUMsRUFBRTtnQkFDL0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsaUNBQWlDLENBQUMsQ0FBQyxDQUFDO1lBQ3RGLENBQUMsQ0FBQyxDQUFDO1lBRUg7Ozs7Ozs7Ozs7Y0FVRTtRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUFBO0FBNUJELGtDQTRCQyJ9