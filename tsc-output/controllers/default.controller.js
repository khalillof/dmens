"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultController = void 0;
const tslib_1 = require("tslib");
const types_config_1 = require("../common/customTypes/types.config");
const types_config_2 = require("../common/customTypes/types.config");
//import { Svc } from 'src/services/Svc.services';
class DefaultController {
    constructor(svs) {
        this.svc = svs;
    }
    static createInstance(svcName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var result = new DefaultController((0, types_config_1.getSvc)(svcName));
            return yield Promise.resolve(result);
        });
    }
    ToList(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            //await getSvc(req.url).Tolist(100, 0)
            this.svc.Tolist(100, 0)
                .then((items) => (0, types_config_2.returnJson)(items, 200, res), (err) => next(err))
                .catch((err) => next(err));
        });
    }
    getById(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // await getSvc(req.url)
            this.svc.getById(req.params.id)
                .then((item) => (0, types_config_2.returnJson)(item, 200, res), (err) => next(err))
                .catch((err) => next(err));
        });
    }
    create(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // await getSvc(req.url)
            this.svc.create(req.body).then((item) => {
                console.log('document Created :', item);
                (0, types_config_2.returnJson)({ id: item.id }, 201, res);
            }, (err) => next(err))
                .catch((err) => next(err));
        });
    }
    patch(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // await getSvc(req.url)
            this.svc.patchById(req.body)
                .then(() => (0, types_config_2.returnJson)({ "status": "OK" }, 204, res), (err) => next(err))
                .catch((err) => next(err));
        });
    }
    put(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // await getSvc(req.url)
            this.svc.putById(Object.assign({ _id: req.params.Id }, req.body))
                .then(() => (0, types_config_2.returnJson)({ "status": "OK" }, 204, res), (err) => next(err))
                .catch((err) => next(err));
        });
    }
    remove(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            //await getSvc(req.url)
            this.svc.deleteById(req.params.id)
                .then(() => (0, types_config_2.returnJson)({ "status": "OK" }, 204, res), (err) => next(err))
                .catch((err) => next(err));
        });
    }
    ////// helpers
    extractId(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            req.body.id = req.params.id;
            next();
        });
    }
}
exports.DefaultController = DefaultController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL2RlZmF1bHQuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEscUVBQXlEO0FBQ3pELHFFQUE2RDtBQUU3RCxrREFBa0Q7QUFDbEQsTUFBYSxpQkFBaUI7SUFFMUIsWUFBbUIsR0FBUTtRQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFDTSxNQUFNLENBQU8sY0FBYyxDQUFDLE9BQWM7O1lBQzdDLElBQUksTUFBTSxHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBQSxxQkFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdEQsT0FBUSxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBQ00sTUFBTSxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUF5Qjs7WUFDN0Usc0NBQXNDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQ3RCLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBQSx5QkFBVSxFQUFDLEtBQUssRUFBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDaEUsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQXlCOztZQUNqRix3QkFBd0I7WUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENB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