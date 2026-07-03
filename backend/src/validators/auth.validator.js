const { body } = require("express-validator");

const registerValidator = [

    body("firstName")
        .notEmpty()
        .withMessage("First name is required"),

    body("lastName")
        .notEmpty()
        .withMessage("Last name is required"),

    body("email")
        .isEmail()
        .withMessage("Invalid Email"),

    body("phone")
        .isLength({ min: 10, max: 10 })
        .withMessage("Invalid Phone"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password should contain minimum 6 characters")

];

const loginValidator = [

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")

];

module.exports = {

    registerValidator,
    loginValidator

};