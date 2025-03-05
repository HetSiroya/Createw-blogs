const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { log } = require('console');

const uploadDir = 'public/uploads/';

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    // log('Upload directory does not exist. Creating...');
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/");
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        file.originalname =
            "uploads/" + file.originalname.trim();
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
