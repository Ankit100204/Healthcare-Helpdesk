const { body } = require("express-validator");

const generateSlotValidator = [

    body("doctorId")
        .notEmpty()
        .withMessage("Doctor Id is required"),

    body("date")
        .isISO8601()
        .withMessage("Invalid date"),

    body("startTime")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid start time"),

    body("endTime")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid end time"),

    body("slotDuration")
        .isInt({
            min: 5,
            max: 120
        })
        .withMessage("Slot duration should be between 5 and 120 minutes")

];

module.exports = {

    generateSlotValidator

};