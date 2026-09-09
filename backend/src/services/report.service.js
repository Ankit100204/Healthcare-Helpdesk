const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const logger = require("../config/logger")
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const MedicalReport = require("../models/MedicalReport");
const notificationService = require("../services/notification.service");
const ApiError = require("../utils/ApiError");
const { NOTIFICATION_TYPES } = require("../constants/notificationTypes");
const { APPOINTMENT_STATUS } = require("../constants/appointmentStatus");
const fileService = require("./file.service");
const { ensureReportAccess } = require("../utils/authorization");
const { getPagination, createPaginationResponse } = require("../utils/pagination");
const { ROLES } = require("../constants/roles");

const findDoctor = async (userId, session = null) => {
    const query = Doctor.findOne({ user: userId });
    if (session) { query.session(session); }
    const doctor = await query;
    if (!doctor) { throw new ApiError(404, "Doctor profile not found"); }
    return doctor;
};

const findAppointment = async (appointmentId, session = null) => {
    const query = Appointment.findById(appointmentId)
        .populate({ path: "patient", select: "user" })
        .populate({ path: "doctor", populate: { path: "user", select: "firstName lastName email phone" } })
        .populate("slot");
    if (session) { query.session(session); }
    const appointment = await query;
    if (!appointment) { throw new ApiError(404, "Appointment not found"); }
    return appointment;
};

const validateAppointment = (appointment, doctor) => {
    if (!appointment.doctor.equals(doctor._id)) {
        throw new ApiError(403, "You are not authorized to upload reports for this appointment");
    }
    if (appointment.status !== APPOINTMENT_STATUS.COMPLETED) {
        throw new ApiError(400, "Medical report can only be uploaded after appointment completion");
    }
};

const createMedicalReport = async (appointment, doctor, userId, reportData, filePath, session) => {
    const reports = await MedicalReport.create(
        [{
            appointment: appointment._id,
            patient: appointment.patient,
            doctor: doctor._id,
            uploadedBy: userId,
            title: reportData.title,
            description: reportData.description,
            reportType: reportData.reportType,
            reportUrl: filePath
        }],
        { session }
    );
    return reports[0];
};

const populateMedicalReport = async (reportId) => {
    return await MedicalReport.findById(reportId)
        .populate({ path: "doctor", populate: { path: "user", select: "firstName lastName email" } })
        .populate({ path: "patient", populate: { path: "user", select: "firstName lastName email" } })
        .populate("appointment");
};

const uploadMedicalReport = async (userId, reportData, file) => {
    if (!file) { throw new ApiError(400, "Medical report file is required"); }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const doctor = await findDoctor(userId, session);
        const appointment = await findAppointment(reportData.appointmentId, session);
        validateAppointment(appointment, doctor);
        const report = await createMedicalReport(appointment, doctor, userId, reportData, `/uploads/reports/${file.filename}`, session);
        await session.commitTransaction();
        try {
            await notificationService.createNotification({
                recipient: appointment.patient.user,
                title: "Medical Report Uploaded",
                message: "Your doctor uploaded a new medical report.",
                type: NOTIFICATION_TYPES.REPORT_UPLOADED,
                metadata: { reportId: report._id, appointmentId: appointment._id }
            });
        } catch (error) { logger.error(error); }
        return await populateMedicalReport(report._id);
    } catch (error) {
        if (session.inTransaction()) { await session.abortTransaction(); }
        if (file?.path) { await fileService.deleteFile(file.path); }
        throw error;
    } finally { session.endSession(); }
};

const getMyReports = async (userId, query) => {
    const patient = await Patient.findOne({ user: userId });
    if (!patient) { throw new ApiError(404, "Patient profile not found"); }
    const { page, limit, skip } = getPagination(query);
    const filter = { patient: patient._id, isDeleted: false };
    if (query.reportType) { filter.reportType = query.reportType; }
    const reports = await MedicalReport.find(filter)
        .populate({ path: "doctor", populate: { path: "user", select: "firstName lastName" } })
        .sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await MedicalReport.countDocuments(filter);
    return createPaginationResponse({ data: reports, total, page, limit });
};

const getDoctorReports = async (userId, query) => {
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) { throw new ApiError(404, "Doctor profile not found"); }
    const { page, limit, skip } = getPagination(query);
    const filter = { doctor: doctor._id, isDeleted: false };
    if (query.reportType) { filter.reportType = query.reportType; }
    const reports = await MedicalReport.find(filter)
        .populate({ path: "patient", populate: { path: "user", select: "firstName lastName email" } })
        .sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await MedicalReport.countDocuments(filter);
    return createPaginationResponse({ data: reports, total, page, limit });
};

const getReportById = async (userId, role, reportId) => {
    const report = await populateMedicalReport(reportId);
    if (!report || report.isDeleted) { throw new ApiError(404, "Medical report not found"); }
    ensureReportAccess(report, userId, role);
    return report;
};

const downloadReport = async (userId, role, reportId) => {
    const report = await populateMedicalReport(reportId);
    if (!report || report.isDeleted) { throw new ApiError(404, "Medical report not found"); }
    ensureReportAccess(report, userId, role);
    if (!report.reportUrl) { throw new ApiError(404, "Report file not found"); }
    // reportUrl may be stored as "/uploads/reports/<file>" (relative) or an
    // absolute path (e.g. Windows "C:\\...\\uploads\\reports\\<file>"). Always
    // resolve using just the filename against the container's uploads directory.
    const storedName = report.reportUrl.split(/[\\/]/).pop();
    if (!storedName) { throw new ApiError(404, "Report file not found"); }
    const absolutePath = path.join(process.cwd(), "uploads", "reports", storedName);
    if (!fs.existsSync(absolutePath)) { throw new ApiError(404, "Report file not found on server"); }
    const ext = path.extname(absolutePath) || ".pdf";
    const sanitizedTitle = report.title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
    return { absolutePath, originalName: `${sanitizedTitle || "report"}${ext}` };
};

const deleteReport = async (userId, role, reportId) => {
    const report = await populateMedicalReport(reportId);
    if (role !== ROLES.DOCTOR && role !== ROLES.ADMIN) {
        throw new ApiError(403, "You are not authorized to delete reports");
    }
    ensureReportAccess(report, userId, role);
    if (!report) { throw new ApiError(404, "Medical report not found"); }
    report.isDeleted = true;
    await report.save();
    return report;
};

module.exports = {
    uploadMedicalReport,
    getMyReports,
    getReportById,
    deleteReport,
    getDoctorReports,
    downloadReport
};
