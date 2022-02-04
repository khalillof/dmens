"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultController = void 0;
const tslib_1 = require("tslib");
const types_config_1 = require("../common/customTypes/types.config");
const types_config_2 = require("../common/customTypes/types.config");
class DefaultController {
    constructor(name) {
        this.setDb(name);
    }
    setDb(url) {
        this.svc = (0, types_config_1.getDb)(url);
    }
    static createInstance(svcName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var result = new DefaultController(svcName);
            if (!result.svc) {
                result.setDb(svcName);
            }
            return yield Promise.resolve(result);
        });
    }
    ToList(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, types_config_1.getDb)(req.url).Tolist(100, 0)
                .then((items) => (0, types_config_2.returnJson)(items, 200, res), (err) => next(err))
                .catch((err) => next(err));
        });
    }
    getById(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, types_config_1.getDb)(req.url).getById(req.params.id)
                .then((item) => (0, types_config_2.returnJson)(item, 200, res), (err) => next(err))
                .catch((err) => next(err));
        });
    }
    create(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, types_config_1.getDb)(req.url).create(req.body).then((item) => {
                console.log('document Created :', item);
                (0, types_config_2.returnJson)({ id: item.id }, 201, res);
            }, (err) => next(err))
                .catch((err) => next(err));
        });
    }
    patch(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, types_config_1.getDb)(req.url).patchById(req.body)
                .then(() => (0, types_config_2.returnJson)({ "status": "OK" }, 204, res), (err) => next(err))
                .catch((err) => next(err));
        });
    }
    put(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, types_config_1.getDb)(req.url).putById(Object.assign({ _id: req.params.Id }, req.body))
                .then(() => (0, types_config_2.returnJson)({ "status": "OK" }, 204, res), (err) => next(err))
                .catch((err) => next(err));
        });
    }
    remove(req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, types_config_1.getDb)(req.url).deleteById(req.params.id)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vcHVyZXRzL2NvbnRyb2xsZXJzL2RlZmF1bHQuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEscUVBQXdEO0FBQ3hELHFFQUE2RDtBQUU3RCxNQUFhLGlCQUFpQjtJQUUxQixZQUFtQixJQUFXO1FBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFVO1FBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFBLG9CQUFLLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFFMUIsQ0FBQztJQUNRLE1BQU0sQ0FBTyxjQUFjLENBQUMsT0FBYzs7WUFDL0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBQztnQkFDWixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3pCO1lBQ0QsT0FBUSxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBQ00sTUFBTSxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUF5Qjs7WUFDOUUsTUFBTSxJQUFBLG9CQUFLLEVBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUNqQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUEseUJBQVUsRUFBQyxLQUFLLEVBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQy9ELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFD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