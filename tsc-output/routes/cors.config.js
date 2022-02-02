"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsWithOptions = exports.corss = void 0;
const tslib_1 = require("tslib");
const cors_1 = (0, tslib_1.__importDefault)(require("cors"));
const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200',
    'http://tuban.me', 'http://static.tuban.me', 'http://test.tuban.me', 'http://mobile.tuban.me',
    'https://tuban.me', 'https://static.tuban.me', 'https://test.tuban.me', 'https://mobile.tuban.me'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    // console.log(req.header('Origin'));
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};
exports.corss = (0, cors_1.default)();
exports.corsWithOptions = (0, cors_1.default)(corsOptionsDelegate);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycy5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVzL2NvcnMuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSw2REFBMEI7QUFHMUIsTUFBTSxTQUFTLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSx3QkFBd0IsRUFBRSx1QkFBdUI7SUFDN0YsaUJBQWlCLEVBQUUsd0JBQXdCLEVBQUUsc0JBQXNCLEVBQUUsd0JBQXdCO0lBQzdGLGtCQUFrQixFQUFFLHlCQUF5QixFQUFFLHVCQUF1QixFQUFFLHlCQUF5QixDQUFDLENBQUM7QUFFbkcsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLEdBQU8sRUFBRSxRQUFZLEVBQU0sRUFBRTtJQUNwRCxJQUFJLFdBQVcsQ0FBQztJQUNqQixxQ0FBcUM7SUFDcEMsSUFBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUMvQyxXQUFXLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDbEM7U0FDSTtRQUNELFdBQVcsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQztLQUNuQztJQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDO0FBRVMsUUFBQSxLQUFLLEdBQUcsSUFBQSxjQUFJLEdBQUUsQ0FBQztBQUNmLFFBQUEsZUFBZSxHQUFHLElBQUEsY0FBSSxFQUFDLG1CQUFtQixDQUFDLENBQUMifQ==