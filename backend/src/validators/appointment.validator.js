const { body } = require("express-validator");

const bookAppointmentValidator = [

    // body("doctorId")
    //     .notEmpty()
    //     .withMessage("Doctor is required"),

    body("slotId")
        .notEmpty()
        .withMessage("Slot is required"),

    body("reason")
        .trim()
        .notEmpty()
        .withMessage("Reason is required"),

    body("symptoms")
        .optional()
        .isArray()
        .withMessage("Symptoms should be an array")

];

const updateAppointmentStatusValidator = [

    body("status")
        .isIn([
            "confirmed",
            "in_progress",
            "completed",
            "rejected",
            "no_show"
        ])
        .withMessage("Invalid appointment status")

];

const cancelAppointmentValidator = [

    body("reason")
        .trim()
        .notEmpty()
        .withMessage("Cancellation reason is required")

];
const rescheduleAppointmentValidator = [

    body("slotId")
        .notEmpty()
        .withMessage("New slot is required")

];
module.exports = {
    bookAppointmentValidator,
    updateAppointmentStatusValidator,
    cancelAppointmentValidator,
    rescheduleAppointmentValidator

};