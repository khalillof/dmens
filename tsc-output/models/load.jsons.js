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
        return yield Promise.resolve(jmodel);
        //return createInstance(JsonModel,jsonModel)
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC5qc29ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3B1cmV0cy9tb2RlbHMvbG9hZC5qc29ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNkRBQXdCO0FBQ3hCLHNCQUFzQjtBQUN0Qix5REFBb0I7QUFDcEIscUVBQWdDO0FBQ2hDLHFFQUF5RTtBQUN6RSw2Q0FBeUM7QUFHekMsU0FBc0IsU0FBUyxDQUFDLGFBQXNCOzs7UUFDbEQsTUFBTSxNQUFNLEdBQTRCLEVBQUUsQ0FBQztRQUMzQyxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFckYsSUFBSTtZQUNBLE1BQU0sU0FBUyxHQUFHLE1BQU0sWUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O2dCQUN4RCxLQUE2QixJQUFBLGNBQUEsMkJBQUEsU0FBUyxDQUFBLGVBQUE7b0JBQTNCLE1BQU0sUUFBUSxzQkFBQSxDQUFBO29CQUNyQixJQUFJLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssT0FBTyxFQUFFO3dCQUVwQyxJQUFJLEtBQUssR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDNUMsSUFBSSxJQUFJLEdBQUcsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQ3JELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQy9CLElBQUcsQ0FBRSxPQUFPLENBQUMsSUFBSSxFQUFDOzRCQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQTt5QkFDeEQ7d0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3FCQUMxQztpQkFDSjs7Ozs7Ozs7O1NBQ0o7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdEI7UUFFRCxPQUFPLE1BQU0sQ0FBQzs7Q0FDakI7QUF2QkQsOEJBdUJDO0FBQUEsQ0FBQztBQUdGLFNBQWUsVUFBVSxDQUFDLE9BQW1COztRQUV6QyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUE7UUFFRixPQUFPLE1BQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FBQTtBQUNELHdCQUF3QjtBQUN4QixTQUFTLGVBQWUsQ0FBQyxJQUFTO0lBQzlCLGdCQUFnQjtJQUNoQixNQUFNLFlBQVksR0FBRztRQUNqQixRQUFRLEVBQUUsTUFBTTtRQUNoQixRQUFRLEVBQUUsTUFBTTtRQUNoQixRQUFRLEVBQUUsTUFBTTtRQUNoQixTQUFTLEVBQUUsT0FBTztRQUNsQixLQUFLLEVBQUUsa0JBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDckMsZ0NBQWdDLEVBQUUsa0JBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDaEUsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRTtLQUNqRCxDQUFBO0lBQ0QsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkQsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUU7WUFDL0IsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzdCO2FBQU07WUFDSCxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDM0QsSUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFO29CQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDO2lCQUM1QjthQUNKO1NBQ0o7S0FFSjtBQUNMLENBQUM7QUFFRCxTQUFlLFNBQVMsQ0FBQyxVQUFzQjs7UUFDM0MsSUFBSSxNQUFNLEdBQUUsTUFBTSxzQkFBUyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUN0RCxzQkFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDbEMsT0FBUSxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsNENBQTRDO0lBQ2hELENBQUM7Q0FBQSJ9