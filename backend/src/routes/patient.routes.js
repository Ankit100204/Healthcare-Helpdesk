const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
    updateProfile,
    getProfile
} = require("../controllers/patient.controller");

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

module.exports = router;