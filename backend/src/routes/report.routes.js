const express = require("express");

const router = express.Router();

const reportController =
    require("../controllers/report.controller");

const protect =
    require("../middleware/auth.middleware");

const authorize =
    require("../middleware/role.middleware");

const validate =
    require("../middleware/validate.middleware");

const {
    createUploader
} = require("../middleware/upload.middleware");

const {
    UPLOAD_CONFIG
} = require("../constants/uploadConfig");

const {
    createReportValidator,
    reportIdValidator
} =
    require("../validators/report.validator");

const { ROLES } = require("../constants/roles");

router.post(

    "/",

    protect,

    authorize(ROLES.DOCTOR),

    createUploader(

        UPLOAD_CONFIG.REPORT

    ).single("file"),

    createReportValidator,

    validate,

    reportController.uploadMedicalReport

);
router.get(

    "/my",

    protect,

    authorize(ROLES.PATIENT),

    reportController.getMyReports

);
router.get(

    "/doctor/my",

    protect,

    authorize(ROLES.DOCTOR),

    reportController.getDoctorReports

);
router.get(
    "/:id/download",

    protect,

    authorize(

        ROLES.PATIENT,

        ROLES.DOCTOR,

        ROLES.ADMIN

    ),

    reportIdValidator,

    validate,

    reportController.downloadReport

);
router.get(
    "/:id",

    protect,

    authorize(

        ROLES.PATIENT,

        ROLES.DOCTOR,

        ROLES.ADMIN

    ),

    reportIdValidator,

    validate,

    reportController.getReportById

);
router.delete(

    "/:id",

    protect,

    authorize(

        ROLES.DOCTOR,

        ROLES.ADMIN

    ),

    reportIdValidator,

    validate,

    reportController.deleteReport

);
module.exports = router;
