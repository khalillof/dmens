"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonModel = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = (0, tslib_1.__importStar)(require("mongoose"));
const passport_1 = (0, tslib_1.__importDefault)(require("passport"));
var passportLocalMongoose = require('passport-local-mongoose');
const passport_local_1 = require("passport-local");
class JsonModel {
    constructor(jsonMdl) {
        this.name = jsonMdl.name || "";
        this.schema = new mongoose_1.Schema(jsonMdl.schema, { timestamps: true });
        if (jsonMdl.name === 'User') {
            this.schema.plugin(passportLocalMongoose);
            const vm = mongoose_1.default.model(this.name, this.schema);
            passport_1.default.use(new passport_local_1.Strategy(vm.authenticate()));
            passport_1.default.serializeUser(vm.serializeUser);
            passport_1.default.deserializeUser(vm.deserializeUser());
            this.model = vm;
            console.log("added Db & Svc to local stores :" + jsonMdl.name);
        }
        else {
            this.model = mongoose_1.default.model(this.name, this.schema);
            console.log("added Db & Svc to local stores :" + jsonMdl.name);
        }
    }
    static createInstance(jsonModel) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let dbb = new JsonModel(jsonModel);
            return yield Promise.resolve(dbb);
        });
    }
    getModelName() {
        return this.name;
    }
    getSchema() {
        return this.schema;
    }
    ;
    getModel() {
        return this.model;
    }
    ///////////////////////////////////////////////////////
    create(obj) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.model.create(obj);
        });
    }
    getById(objId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.model.findOne({ _id: objId });
        });
    }
    putById(objFields) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(objFields._id, objFields);
        });
    }
    deleteById(objId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.model.deleteOne({ _id: objId });
        });
    }
    Tolist(limit = 25, page = 0) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.model.find()
                .limit(limit)
                .skip(limit * page)
                .exec();
        });
    }
    patchById(objFields) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate(objFields._id, objFields);
        });
    }
}
exports.JsonModel = JsonModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSnNvbi5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3B1cmV0cy9tb2RlbHMvSnNvbi5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsa0VBQWtEO0FBRWxELHFFQUFnQztBQUNoQyxJQUFJLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQy9ELG1EQUEyRDtBQUUzRCxNQUFhLFNBQVM7SUFFbEIsWUFBWSxPQUFrQjtRQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxpQkFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUUvRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDMUMsTUFBTSxFQUFFLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEQsa0JBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSx5QkFBYSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkQsa0JBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3pDLGtCQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzdEO2FBQU07WUFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLGtCQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ2pFO0lBQ0wsQ0FBQztJQUtNLE1BQU0sQ0FBTyxjQUFjLENBQUMsU0FBb0I7O1lBQ3JELElBQUksR0FBRyxHQUFJLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLE9BQU8sTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7S0FBQTtJQUNELFlBQVk7UUFDUixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUFBLENBQUM7SUFFRixRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCx1REFBdUQ7SUFDakQsTUFBTSxDQUFDLEdBQVE7O1lBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEtBQWE7O1lBQ3ZCLE9BQU8sTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxTQUFjOztZQUN6QixPQUFPLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7S0FBQTtJQUVLLFVBQVUsQ0FBQyxLQUFhOztZQUM1QixPQUFPLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFFSyxNQUFNLENBQUMsUUFBZ0IsRUFBRSxFQUFFLE9BQWUsQ0FBQzs7WUFDN0MsT0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtpQkFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQztpQkFDWixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztpQkFDbEIsSUFBSSxFQUFFLENBQUM7UUFDaEIsQ0FBQztLQUFBO0lBRUssU0FBUyxDQUFDLFNBQWM7O1lBQzdCLE9BQU8sTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEUsQ0FBQztLQUFBO0NBQ047QUFsRUQsOEJBa0VDIn0=