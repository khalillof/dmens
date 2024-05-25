"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSchema = exports.uploadImages = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const index_js_1 = require("../../common/index.js");
const multer_1 = tslib_1.__importDefault(require("multer"));
function setMulter(uploadDir, filterCallback, fieldsNum = 1) {
    return (0, multer_1.default)({
        dest: uploadDir,
        limits: { fieldNameSize: 30, fieldSize: 1048576, fields: fieldsNum, fileSize: 1048576, files: fieldsNum, headerPairs: 20 },
        fileFilter: filterCallback,
        storage: multer_1.default.diskStorage({
            destination: (req, file, cb) => cb(null, uploadDir),
            filename: (req, file, cb) => cb(null, file.fieldname + '.' + Date.now() + path_1.default.extname(file.originalname))
        })
    });
}
const imagesFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const schemaFilter = (req, file, cb) => file.mimetype === 'application/json' && path_1.default.extname(file.originalname) === '.json' ? cb(null, true) : cb(null, false);
function errCallback(req, res, err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (err instanceof multer_1.default.MulterError) {
        return res.json(err);
    }
    else if (req.fileValidationError) {
        return res.json(req.fileValidationError);
    }
    else if (err) {
        return res.json(err);
    }
}
function uploadSchema(req, res, next) {
    setMulter(index_js_1.envs.schemaDir(), schemaFilter).single('schema')(req, res, (err) => err ? errCallback(req, res, err) : next());
}
exports.uploadSchema = uploadSchema;
;
function uploadImages(req, res, next) {
    setMulter(index_js_1.envs.imagesUploadDir(), imagesFilter, 10).array('photos', 10)(req, res, (err) => err ? errCallback(req, res, err) : next());
}
exports.uploadImages = uploadImages;
;
