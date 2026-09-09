const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const { REPORT_TYPES } = require("../constants/reportTypes");

const isValidObjectId = (value) =>
    mongoose.Types.ObjectId.isValid(value);

const createReportValidator = [

    body("appointmentId")
        .notEmpty()
        .withMessage("Appointment ID is required")
        .custom((value) => {
            if (!isValidObjectId(value)) {
                throw new Error("Invalid appointment ID");
            }
            return true;
        }),

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({
            min: 3,
            max: 100
        })
        .withMessage("Title must be between 3 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({
            max: 1000
        })
        .withMessage("Description cannot exceed 1000 characters"),

    body("reportType")
        .notEmpty()
        .withMessage("Report type is required")
        .isIn(Object.values(REPORT_TYPES))
        .withMessage("Invalid report type")

];

const reportIdValidator = [

    param("id")
        .custom((value) => {

            if (!isValidObjectId(value)) {

                throw new Error(
                    "Invalid report id"
                );

            }

            return true;

        })

];

module.exports = {

    createReportValidator,

    reportIdValidator

};