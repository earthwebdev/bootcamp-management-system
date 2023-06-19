import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // file.fieldname

        //cb(null, Date.now() + '-' + file.originalname)
    }
});

const fileFilter = (req, res, cb) => {
    console.log(file.mimetype);
    console.log(file)
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' ){
        cb(null, true)
    }else{
        cb(new Error("Invalid file type. Only image is required"));
    }
}

const upload = multer(
    {
        storage,
        limits: {
            fileSize: 5*1024*1024 //5Mb max size
        },

    }
);

export default upload;