const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const authorize = require("../middleware/role.middleware");

const { ROLES } = require("../constants/roles");

const { createUploader } = require("../middleware/upload.middleware");

const { UPLOAD_CONFIG } = require("../constants/uploadConfig");

const fileController = require("../controllers/file.controller");

router.post(

    "/report",

    protect,

    authorize(
        ROLES.DOCTOR
    ),

    createUploader(
        UPLOAD_CONFIG.REPORT
    ).single("file"),

    fileController.uploadProfileImage

);

router.post(

    "/profile",

    protect,

    createUploader(
        UPLOAD_CONFIG.PROFILE
    ).single("file"),

    fileController.uploadFile

);

module.exports = router;
