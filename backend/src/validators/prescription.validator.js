const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const {
    MEDICINE_FREQUENCY
} = require("../constants/medicineFrequency");

const isValidObjectId = (value) =>
    mongoose.Types.ObjectId.isValid(value);

/**
 * Create Prescription
 */
const createPrescriptionValidator = [

    body("appointmentId")
        .notEmpty()
        .withMessage("Appointment ID is required")
        .custom((value) => {

            if (!isValidObjectId(value)) {
                throw new Error("Invalid appointment ID");
            }

            return true;

        }),

    body("diagnosis")
        .trim()
        .notEmpty()
        .withMessage("Diagnosis is required")
        .isLength({
            min: 3,
            max: 500
        })
        .withMessage("Diagnosis must be between 3 and 500 characters"),

    body("notes")
        .optional()
        .trim()
        .isLength({
            max: 1000
        })
        .withMessage("Notes cannot exceed 1000 characters"),

    body("followUpDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid follow-up date"),

    body("followUpNotes")
        .optional()
        .trim()
        .isLength({
            max: 500
        })
        .withMessage("Follow-up notes cannot exceed 500 characters"),

    body("medicines")
        .isArray({
            min: 1
        })
        .withMessage("At least one medicine is required"),

    body("medicines.*.medicineName")
        .trim()
        .notEmpty()
        .withMessage("Medicine name is required"),

    body("medicines.*.dosage")
        .trim()
        .notEmpty()
        .withMessage("Dosage is required"),

    body("medicines.*.frequency")
        .isIn(
            Object.values(
                MEDICINE_FREQUENCY
            )
        )
        .withMessage("Invalid medicine frequency"),

    body("medicines.*.duration")
        .trim()
        .notEmpty()
        .withMessage("Duration is required"),

    body("medicines.*.instructions")
        .optional()
        .trim()
        .isLength({
            max: 500
        })
        .withMessage("Instructions cannot exceed 500 characters")

];
const prescriptionIdValidator = [

    param("id")
        .custom((value) => {

            if (!isValidObjectId(value)) {

                throw new Error(
                    "Invalid prescription id"
                );

            }

            return true;

        })

];
module.exports = {

    createPrescriptionValidator,

    prescriptionIdValidator

};