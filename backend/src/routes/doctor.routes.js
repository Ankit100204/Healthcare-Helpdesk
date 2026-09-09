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
    searchDoctors,
    getDoctorDashboard
} = require("../controllers/doctor.controller");
const {
    createDoctorValidator
} = require("../validators/doctor.validator");

// Public Routes
router.get("/search", searchDoctors);
router.get("/", getAllDoctors);

// Doctor Self-Service Routes
router.get("/dashboard", protect, authorize(ROLES.DOCTOR), getDoctorDashboard);
router.get("/me/profile", protect, authorize(ROLES.DOCTOR), getMyProfile);
router.put("/profile", protect, authorize(ROLES.DOCTOR), updateDoctor);

// Dynamic route MUST be last
router.get("/:id", getDoctorById);

// Admin Routes
router.post("/", protect, authorize(ROLES.ADMIN), createDoctorValidator, validate, createDoctor);
router.put("/:id", protect, authorize(ROLES.ADMIN), updateDoctor);
router.delete("/:id", protect, authorize(ROLES.ADMIN), deleteDoctor);

module.exports = router;
