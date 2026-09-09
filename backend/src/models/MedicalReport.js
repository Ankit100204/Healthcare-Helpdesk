const mongoose = require("mongoose");
const { REPORT_TYPES } = require("../constants/reportTypes");

const medicalReportSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            index: true,
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
            index: true,
        },

        reportType: {
            type: String,
            enum: Object.values(REPORT_TYPES),
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        reportUrl: {
            type: String,
            required: true,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

medicalReportSchema.index({ patient: 1, createdAt: -1 });
medicalReportSchema.index({ doctor: 1, createdAt: -1 });
medicalReportSchema.index({ appointment: 1 });

module.exports = mongoose.model("MedicalReport", medicalReportSchema);
