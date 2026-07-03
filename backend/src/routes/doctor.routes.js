const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const { ROLES } = require("../constants/roles");

const {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    getMyProfile,
    updateDoctor,
    deleteDoctor,
    searchDoctors
} = require("../controllers/doctor.controller");

const {
    createDoctorValidator
} = require("../validators/doctor.validator");

/**
 * Public Routes
 */
router.get("/me/profile", protect, authorize(ROLES.DOCTOR), getMyProfile);

router.get("/search", searchDoctors);

router.get("/", getAllDoctors);

router.get("/:id", getDoctorById);

/**
 * Doctor Routes
 */
router.get(
    "/me/profile",
    protect,
    authorize(ROLES.DOCTOR),
    getMyProfile
);

/**
 * Admin Routes
 */
router.post(
    "/",
    protect,
    authorize(ROLES.ADMIN),
    createDoctorValidator,
    validate,
    createDoctor
);

router.put(
    "/:id",
    protect,
    authorize(ROLES.ADMIN),
    updateDoctor
);

router.delete(
    "/:id",
    protect,
    authorize(ROLES.ADMIN),
    deleteDoctor
);

module.exports = router;