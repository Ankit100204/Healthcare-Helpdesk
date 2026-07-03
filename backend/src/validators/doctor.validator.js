const { body } = require("express-validator");

const createDoctorValidator = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),

    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("phone")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("specialization")
        .notEmpty()
        .withMessage("Specialization is required"),

    body("qualification")
        .notEmpty()
        .withMessage("Qualification is required"),

    body("experience")
        .isNumeric()
        .withMessage("Experience must be a number"),

    body("consultationFee")
        .isNumeric()
        .withMessage("Consultation fee must be a number"),

    body("hospital")
        .notEmpty()
        .withMessage("Hospital is required")

];

module.exports = {
    createDoctorValidator
};