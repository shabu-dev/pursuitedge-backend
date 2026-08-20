const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadDirectory = path.join(
    process.cwd(),
    'uploads',
    'support'
);

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}


// Allowed file types
const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'text/plain',

    // Word
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    // Excel
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    // ZIP
    'application/zip',
    'application/x-zip-compressed'
];


const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadDirectory);

    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const randomName =
            crypto.randomBytes(16).toString('hex');

        cb(
            null,
            `${Date.now()}-${randomName}${extension}`
        );

    }

});


const fileFilter = (req, file, cb) => {

    if (!allowedMimeTypes.includes(file.mimetype)) {

        return cb(
            new Error(
                'File type is not allowed'
            )
        );

    }

    cb(null, true);

};


const upload = multer({

    storage,

    fileFilter,

    limits: {

        // 10 MB per file
        fileSize: 10 * 1024 * 1024,

        // Maximum 5 files per request
        files: 5

    }

});


module.exports = upload;