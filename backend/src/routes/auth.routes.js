const express = require("express");

const router = express.Router();

const { register ,login,getProfile,logout} = require("../controllers/auth.controller");

const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
    registerValidator,loginValidator
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
module.exports = router;