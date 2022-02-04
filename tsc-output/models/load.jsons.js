"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJsons = void 0;
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
//import fs from 'fs';
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const mongoose_1 = (0, tslib_1.__importDefault)(require("mongoose"));
const types_config_1 = require("../common/customTypes/types.config");
const Json_model_1 = require("./Json.model");
const Svc_services_1 = require("../services/Svc.services");
//import { JsonModel } from './json.model';
function loadJsons(directoryPath) {
    var e_1, _a;
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = [];
        const _directory = directoryPath ? directoryPath : path_1.default.join(__dirname, './schema/');
        try {
            const fileNames = yield fs_1.default.promises.readdir(_directory);
            try {
                for (var fileNames_1 = (0, tslib_1.__asyncValues)(fileNames), fileNames_1_1; fileNames_1_1 = yield fileNames_1.next(), !fileNames_1_1.done;) {
                    const fileName = fileNames_1_1.value;
                    if (path_1.default.extname(fileName) === '.json') {
                        let _file = path_1.default.join(_directory, fileName);
                        let data = yield fs_1.default.promises.readFile(_file, 'utf8');
                        let jsonobj = JSON.parse(data);
                        if (!jsonobj.name) {
                            throw new Error(' jschema name is required property');
                        }
                        result.push(yield makeSchema(jsonobj));
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (fileNames_1_1 && !fileNames_1_1.done && (_a = fileNames_1.return)) yield _a.call(fileNames_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (err) {
            console.error(err);
        }
        return result;
    });
}
exports.loadJsons = loadJsons;
;
function makeSchema(jschema) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        Object.entries(jschema.schema).forEach((item) => {
            recursiveSearch(item);
        });
        return yield makeModel(jschema);
    });
}
// search item in object
function recursiveSearch(item) {
    // types mapping
    const typeMappings = {
        "String": String,
        "string": String,
        "Number": Number,
        "Boolean": Boolean,
        "_id": mongoose_1.default.Schema.Types.ObjectId,
        "mongoose.Schema.Types.ObjectId": mongoose_1.default.Schema.Types.ObjectId,
        "Date.now().toString()": Date.now().toString()
    };
    for (let [itemKey, itemValue] of Object.entries(item)) {
        if (typeof itemValue === "object") {
            recursiveSearch(itemValue);
        }
        else {
            for (const [mapKey, mapValue] of Object.entries(typeMappings)) {
                if (itemValue === mapKey) {
                    item[itemKey] = mapValue;
                }
            }
        }
    }
}
function makeModel(jsonSchema) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        let jmodel = yield Json_model_1.JsonModel.createInstance(jsonSchema);
        types_config_1.dbStore[jsonSchema.name] = jmodel;
        types_config_1.SvcStore[jmodel.name] = yield Svc_services_1.Svc.createInstance(jmodel.model);
        return yield Promise.resolve(jmodel);
        //return createInstance(JsonModel,jsonModel)
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC5qc29ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3B1cmV0cy9tb2RlbHMvbG9hZC5qc29ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNkRBQXdCO0FBQ3hCLHNCQUFzQjtBQUN0Qix5REFBb0I7QUFDcEIscUVBQWdDO0FBRWhDLHFFQUFtRjtBQUVuRiw2Q0FBeUM7QUFDekMsMkRBQStDO0FBQy9DLDJDQUEyQztBQUUzQyxTQUFzQixTQUFTLENBQUMsYUFBc0I7OztRQUNsRCxNQUFNLE1BQU0sR0FBNEIsRUFBRSxDQUFDO1FBQzNDLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVyRixJQUFJO1lBQ0EsTUFBTSxTQUFTLEdBQUcsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7Z0JBQ3hELEtBQTZCLElBQUEsY0FBQSwyQkFBQSxTQUFTLENBQUEsZUFBQTtvQkFBM0IsTUFBTSxRQUFRLHNCQUFBLENBQUE7b0JBQ3JCLElBQUksY0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxPQUFPLEVBQUU7d0JBRXBDLElBQUksS0FBSyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUM1QyxJQUFJLElBQUksR0FBRyxNQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDckQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDL0IsSUFBRyxDQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUM7NEJBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO3lCQUN4RDt3QkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7cUJBQzFDO2lCQUNKOzs7Ozs7Ozs7U0FDSjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0QjtRQUVELE9BQU8sTUFBTSxDQUFDOztDQUNqQjtBQXZCRCw4QkF1QkM7QUFBQSxDQUFDO0FBR0YsU0FBZSxVQUFVLENBQUMsT0FBbUI7O1FBRXpDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzVDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQTtRQUVGLE9BQU8sTUFBTSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztDQUFBO0FBQ0Qsd0JBQXdCO0FBQ3hCLFNBQVMsZUFBZSxDQUFDLElBQVM7SUFDOUIsZ0JBQWdCO0lBQ2hCLE1BQU0sWUFBWSxHQUFHO1FBQ2pCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLEtBQUssRUFBRSxrQkFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUNyQyxnQ0FBZ0MsRUFBRSxrQkFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUNoRSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFO0tBQ2pELENBQUE7SUFDRCxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNuRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUMvQixlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7U0FDN0I7YUFBTTtZQUNILEtBQUssTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUMzRCxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUM7aUJBQzVCO2FBQ0o7U0FDSjtLQUVKO0FBQ0wsQ0FBQztBQUVELFNBQWUsU0FBUyxDQUFDLFVBQXNCOztRQUMzQyxJQUFJLE1BQU0sR0FBRSxNQUFNLHNCQUFTLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3RELHNCQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUNsQyx1QkFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLGtCQUFHLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUvRCxPQUFRLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0Qyw0Q0FBNEM7SUFDaEQsQ0FBQztDQUFBIn0=