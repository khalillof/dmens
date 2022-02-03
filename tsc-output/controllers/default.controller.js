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
            res.sendStatus(200);
            //this.svc.Tolist(100, 0)
            //.then((items) => returnJson(items,200, res), (err) => next(err))
            // .catch((err) => next(err));       
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL2RlZmF1bHQuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEscUVBQXlEO0FBQ3pELHFFQUE2RDtBQUU3RCxrREFBa0Q7QUFDbEQsTUFBYSxpQkFBaUI7SUFFMUIsWUFBbUIsR0FBUTtRQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFDTSxNQUFNLENBQU8sY0FBYyxDQUFDLE9BQWM7O1lBQzdDLElBQUksTUFBTSxHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBQSxxQkFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdEQsT0FBUSxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBQ00sTUFBTSxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUF5Qjs7WUFDN0Usc0NBQXNDO1lBQ3RDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIseUJBQXlCO1lBQ3pCLGtFQUFrRTtZQUNuRSxxQ0FBcUM7UUFDM0MsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUF5Qjs7WUFDakYsd0JBQXdCO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2lCQUM5QixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUEseUJBQVUsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzdELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFB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