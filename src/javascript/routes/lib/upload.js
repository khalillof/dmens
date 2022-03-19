const path =require( 'path');
const {config} =require( '../../common');
const multer =require('multer');

function setMulter(uploadDir,filterCallback, fieldsNum = 1){
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

const imagesFilter = (req, file, cb)=> {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const schemaFilter = (req, file, cb) => file.mimetype === 'application/json' && path.extname(file.originalname) === '.json' ? cb(null, true) : cb(null, false)

function errCallback(req,res,err){
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (err instanceof multer.MulterError) {
        return res.json({success:false, error:err});
    }
    else if (req.fileValidationError) {
        return res.json({success:false, error:req.fileValidationError});
    }
    else if (err) {
        console.log(err.stack);
        return res.json({success:false, error:err.message});
    }
}

function uploadSchema(req, res, next){
  return  setMulter(config.schemaDir, schemaFilter).single('schema')(req,res,(err)=> err ? errCallback(req,res,err): next());
};

function uploadImages(req, res, next){
  return setMulter(config.imagesUploadDir, imagesFilter, 10).array('photos', 10)(req,res,(err)=> err ? errCallback(req,res,err): next());
};


module.exports ={uploadImages, uploadSchema}


 