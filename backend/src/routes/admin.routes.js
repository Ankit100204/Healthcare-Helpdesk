const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const { ROLES } = require("../constants/roles");

const {
    getAllPatients,
    getPatientById,
    getAnalytics,
    getAllMedicalReports
} = require("../controllers/admin.controller");

// All admin routes require authentication + admin role
router.use(protect, authorize(ROLES.ADMIN));

router.get("/patients", getAllPatients);
router.get("/patients/:id", getPatientById);
router.get("/analytics", getAnalytics);
router.get("/reports", getAllMedicalReports);

module.exports = router;
