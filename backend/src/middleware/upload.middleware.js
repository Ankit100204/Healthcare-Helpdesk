const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUploader = ({
    destination,
    allowedMimeTypes,
    maxSize
}) => {

    const uploadPath = path.join(
        process.cwd(),
        "uploads",
        destination
    );

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({

        destination(req, file, cb) {
            cb(null, uploadPath);
        },

        filename(req, file, cb) {

            const uniqueName =
                `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;

            cb(null, uniqueName);
        }

    });

    const fileFilter = (req, file, cb) => {

        if (!allowedMimeTypes.includes(file.mimetype)) {

            return cb(
                new Error("Unsupported file type"),
                false
            );

        }

        cb(null, true);

    };

    return multer({

        storage,

        fileFilter,

        limits: {

            fileSize: maxSize

        }

    });

};

module.exports = {
    createUploader
};