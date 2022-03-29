import path from  'path';
import {config} from  '../../common';
import multer from 'multer';

function setMulter(uploadDir:string,filterCallback:Function|any, fieldsNum = 1){
return multer({
    dest: uploadDir,
    limits: { fieldNameSize: 30, fieldSize: 1048576, fields: fieldsNum, fileSize: 1048576, files: fieldsNum, headerPairs: 20 },
    fileFilter: filterCallback,
    storage: multer.diskStorage(
        {
            destination: (req, file, cb) => cb(null,uploadDir),
            filename: (req, file, cb) => cb(null, file.fieldname + '.' + Date.now() + path.extname(file.originalname)) 
        })
});
}

const imagesFilter = (req:any, file:any, cb:any)=> {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const schemaFilter = (req:any, file:any, cb:any) => file.mimetype === 'application/json' && path.extname(file.originalname) === '.json' ? cb(null, true) : cb(null, false)
function errCallback(req:any,res:any,err:any){
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (err instanceof multer.MulterError) {
        return res.json(err);
    }
    else if (req.fileValidationError) {
        return res.json(req.fileValidationError);
    }
    else if (err) {
        return res.json(err);
    }
}

function uploadSchema(req:any, res:any, next:any){
  return  setMulter(config.schemaDir(), schemaFilter).single('schema')(req,res,(err:any)=> err ? errCallback(req,res,err): next());
};

function uploadImages(req:any, res:any, next:any){
  return setMulter(config.imagesUploadDir(), imagesFilter, 10).array('photos', 10)(req,res,(err:any)=> err ? errCallback(req,res,err): next());
};

export {uploadImages, uploadSchema}


 