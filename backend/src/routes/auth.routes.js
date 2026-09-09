const express = require("express");

const router = express.Router();

const { register, login, getProfile, logout, changePassword } = require("../controllers/auth.controller");

const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
    registerValidator, loginValidator, changePasswordValidator
} = require("../validators/auth.validator");

router.post(
    "/register",
    registerValidator,
    validate,
    register
);
router.post("/login",
    loginValidator,
    validate,
    login);

router.get("/me", protect, getProfile);
router.post("/logout", logout);
router.put("/change-password", protect, changePasswordValidator, validate, changePassword);
module.exports = router;
