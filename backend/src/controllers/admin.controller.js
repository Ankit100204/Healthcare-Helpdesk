const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const MedicalReport = require("../models/MedicalReport");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const getAllPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find()
        .populate("user", "-password")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, "Patients fetched successfully", patients)
    );
});

const getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id)
        .populate("user", "-password");

    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Patient fetched successfully", patient)
    );
});

const getAnalytics = asyncHandler(async (req, res) => {
    const [
        totalPatients,
        totalDoctors,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        pendingAppointments,
        totalReports,
        recentAppointments
    ] = await Promise.all([
        Patient.countDocuments(),
        Doctor.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: "completed" }),
        Appointment.countDocuments({ status: "cancelled" }),
        Appointment.countDocuments({ status: "pending" }),
        MedicalReport.countDocuments({ isDeleted: false }),
        Appointment.find()
            .populate({
                path: "patient",
                populate: { path: "user", select: "firstName lastName email" }
            })
            .populate({
                path: "doctor",
                populate: { path: "user", select: "firstName lastName email" }
            })
            .sort({ createdAt: -1 })
            .limit(5)
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Analytics fetched successfully", {
            summary: {
                totalPatients,
                totalDoctors,
                totalAppointments,
                completedAppointments,
                cancelledAppointments,
                pendingAppointments,
                totalReports
            },
            recentAppointments
        })
    );
});

const getAllMedicalReports = asyncHandler(async (req, res) => {
    const reports = await MedicalReport.find({ isDeleted: false })
        .populate({
            path: "doctor",
            populate: { path: "user", select: "firstName lastName email" }
        })
        .populate({
            path: "patient",
            populate: { path: "user", select: "firstName lastName email" }
        })
        .populate("appointment")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, "Reports fetched successfully", reports)
    );
});

module.exports = {
    getAllPatients,
    getPatientById,
    getAnalytics,
    getAllMedicalReports
};
