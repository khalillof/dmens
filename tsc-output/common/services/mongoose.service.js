"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbInit = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = (0, tslib_1.__importDefault)(require("mongoose"));
const config_1 = require("../../bin/config");
const load_jsons_1 = require("../../models/load.jsons");
/////////////////
const dbOptions = {
    rejectUnauthorized: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify : false, // are not supported any more
    //useCreateIndex : true, // are not supported any more
};
function dbInit() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        console.log("=========== db initiation started ===============");
        yield dbConnect(config_1.config.mongoUrl.dev, dbOptions).then(() => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield (0, load_jsons_1.loadJsons)().then((data) => {
                console.log('total models : ' + data.length);
            }).catch((err) => {
                console.error(err);
            });
        }));
        return yield Promise.resolve(console.log("=========== db initiation finished ==============="));
    });
}
exports.dbInit = dbInit;
function dbConnect(dbURL, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(dbURL, options);
        mongoose_1.default.connection
            .on('error', () => console.error.bind(console, 'connection error:'))
            .on('open', () => console.log("Successfully Connected to db!"));
    });
}
//=================================================================
function dbConnectWithReTry(dbURL, options) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        var db = yield mongoose_1.default.createConnection(dbURL, options);
        db.on('error', function (err) {
            // If first connect fails because mongod is down, try again later.
            // This is only needed for first connect, not for runtime reconnects.
            // See: https://github.com/Automattic/mongoose/issues/5169
            if (err) {
                console.log(new Date(), String(err));
                // Wait for a bit, then try to connect again
                setTimeout(function () {
                    console.log("Retrying first connect...");
                    db.openUri(dbURL).catch(() => { });
                    // Why the empty catch?
                    // Well, errors thrown by db.open() will also be passed to .on('error'),
                    // so we can handle them there, no need to log anything in the catch here.
                    // But we still need this empty catch to avoid unhandled rejections.
                }, 3 * 1000);
            }
            else {
                // Some other error occurred.  Log it.
                console.error(new Date(), String(err));
            }
        });
        db.once('open', function () {
            console.log("Connection to db established.");
        });
        return db;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29vc2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1cmV0cy9jb21tb24vc2VydmljZXMvbW9uZ29vc2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EscUVBQWdDO0FBRWhDLDZDQUF5QztBQUN6Qyx3REFBbUQ7QUFDbkQsaUJBQWlCO0FBQ2pCLE1BQU0sU0FBUyxHQUFFO0lBQ1gsa0JBQWtCLEVBQUUsSUFBSTtJQUN4QixlQUFlLEVBQUUsSUFBSTtJQUNyQixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLHlEQUF5RDtJQUN6RCxzREFBc0Q7Q0FFdkQsQ0FBQztBQUVOLFNBQXNCLE1BQU07O1FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELENBQUMsQ0FBQTtRQUNqRSxNQUFNLFNBQVMsQ0FBQyxlQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBUSxFQUFFO1lBRTlELE9BQU8sTUFBTSxJQUFBLHNCQUFTLEdBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUF1QixFQUFFLEVBQUU7Z0JBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRS9DLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDLENBQUE7SUFDaEcsQ0FBQztDQUFBO0FBYkQsd0JBYUM7QUFDRCxTQUFlLFNBQVMsQ0FBRSxLQUFZLEVBQUUsT0FBVTs7UUFDaEQsTUFBTSxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsa0JBQVEsQ0FBQyxVQUFVO2FBQ2xCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDLENBQUM7YUFDbkUsRUFBRSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0NBQUE7QUFFRCxtRUFBbUU7QUFDbkUsU0FBZSxrQkFBa0IsQ0FBRSxLQUFZLEVBQUUsT0FBVTs7UUFDekQsSUFBSSxFQUFFLEdBQUcsTUFBTSxrQkFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV6RCxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQUc7WUFDeEIsa0VBQWtFO1lBQ2xFLHFFQUFxRTtZQUNyRSwwREFBMEQ7WUFDMUQsSUFBSSxHQUFHLEVBQUU7Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUVyQyw0Q0FBNEM7Z0JBQzVDLFVBQVUsQ0FBQztvQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7b0JBQ3pDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNsQyx1QkFBdUI7b0JBQ3ZCLHdFQUF3RTtvQkFDeEUsMEVBQTBFO29CQUMxRSxvRUFBb0U7Z0JBQ3hFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFFaEI7aUJBQU07Z0JBQ0gsc0NBQXNDO2dCQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDMUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0NBQUEifQ==