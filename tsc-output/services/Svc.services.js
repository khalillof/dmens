"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Svc = void 0;
const tslib_1 = require("tslib");
class Svc {
    constructor(svc) {
        this.db = svc;
    }
    static createInstance(data) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var result = new Svc(data);
            return yield Promise.resolve(result);
        });
    }
    create(obj) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let res = this.db.create(obj);
            return yield Promise.resolve(res);
        });
    }
    getById(objId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.db.findOne({ _id: objId });
        });
    }
    putById(objFields) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.db.findByIdAndUpdate(objFields._id, objFields);
        });
    }
    deleteById(objId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.db.deleteOne({ _id: objId });
        });
    }
    Tolist(limit = 25, page = 0) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.db.find()
                .limit(limit)
                .skip(limit * page)
                .exec();
        });
    }
    patchById(objFields) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.db.findOneAndUpdate(objFields._id, objFields);
        });
    }
}
exports.Svc = Svc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ZjLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL1N2Yy5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUEsTUFBYSxHQUFHO0lBSVosWUFBWSxHQUFrQjtRQUMxQixJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUNsQixDQUFDO0lBQ0ssTUFBTSxDQUFRLGNBQWMsQ0FBQyxJQUFtQjs7WUFDcEQsSUFBSSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsT0FBUSxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsQ0FBQztLQUFBO0lBRUEsTUFBTSxDQUFDLEdBQVE7O1lBQ3BCLElBQUksR0FBRyxHQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQzVCLE9BQVEsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxLQUFhOztZQUN2QixPQUFPLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUMvQyxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsU0FBYzs7WUFDekIsT0FBTyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwRSxDQUFDO0tBQUE7SUFFSyxVQUFVLENBQUMsS0FBYTs7WUFDNUIsT0FBTyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQztLQUFBO0lBRUssTUFBTSxDQUFDLFFBQWdCLEVBQUUsRUFBRSxPQUFlLENBQUM7O1lBQzdDLE9BQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUU7aUJBQ2pCLEtBQUssQ0FBQyxLQUFLLENBQUM7aUJBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7aUJBQ2xCLElBQUksRUFBRSxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQUVLLFNBQVMsQ0FBQyxTQUFjOztZQUM3QixPQUFPLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7S0FBQTtDQUNBO0FBdkNELGtCQXVDQyJ9