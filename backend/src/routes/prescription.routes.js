const express = require("express");

const router = express.Router();

const prescriptionController =
    require("../controllers/prescription.controller");

const { ROLES } = require("../constants/roles");

const protect =
    require("../middleware/auth.middleware");

const authorize =
    require("../middleware/role.middleware");

const validate =
    require("../middleware/validate.middleware");

const {
    createPrescriptionValidator,
    prescriptionIdValidator
} =
    require("../validators/prescription.validator");


router.post(

    "/",

    protect,

    authorize(ROLES.DOCTOR),

    createPrescriptionValidator,

    validate,

    prescriptionController.createPrescription

);
router.get(

    "/my",

    protect,

    authorize(ROLES.PATIENT),

    prescriptionController.getMyPrescriptions

);
router.get(

    "/doctor",

    protect,

    authorize(ROLES.DOCTOR),

    prescriptionController.getDoctorPrescriptions

);
router.get(

    "/all",

    protect,

    authorize(ROLES.ADMIN),

    prescriptionController.getAllPrescriptions

);
router.get(

    "/:id",

    protect,

    authorize(

        ROLES.PATIENT,

        ROLES.DOCTOR,

        ROLES.ADMIN

    ),

    prescriptionIdValidator,

    validate,

    prescriptionController.getPrescriptionById

);
router.put(

    "/:id",

    protect,

    authorize(

        ROLES.DOCTOR

    ),

    prescriptionIdValidator,

    createPrescriptionValidator,

    validate,

    prescriptionController.updatePrescription

);
router.delete(

    "/:id",

    protect,

    authorize(

        ROLES.DOCTOR,

        ROLES.ADMIN

    ),

    prescriptionIdValidator,

    validate,

    prescriptionController.deletePrescription

);

module.exports = router;