import multer from 'multer';

const storage = multer.diskStorage({
    // Place where the file will be temporarily stored
    destination: function(req, file, cb) {
        cb(null, './public/temp');
    },

    // File name
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage });
