const mongoose = require("mongoose");
const logger = require("../config/logger");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { getPagination, createPaginationResponse } = require("../utils/pagination");
const ApiError = require("../utils/ApiError");
const notificationService = require("../services/notification.service");
const { APPOINTMENT_STATUS } = require("../constants/appointmentStatus");
const { NOTIFICATION_TYPES } = require("../constants/notificationTypes");
const { ensurePrescriptionAccess } = require("../utils/ensurePrescAccess");

const findDoctor = async (userId, session = null) => {
    const query = Doctor.findOne({ user: userId });
    if (session) query.session(session);
    const doctor = await query;
    if (!doctor) throw new ApiError(404, "Doctor profile not found");
    return doctor;
};

const findAppointment = async (appointmentId, session = null) => {
    const query = Appointment.findById(appointmentId);
    if (session) query.session(session);
    const appointment = await query;
    if (!appointment) throw new ApiError(404, "Appointment not found");
    return appointment;
};

const validateAppointment = (appointment, doctor) => {
    if (!appointment.doctor.equals(doctor._id)) {
        throw new ApiError(403, "You are not authorized for this appointment");
    }
    if (appointment.status !== APPOINTMENT_STATUS.COMPLETED) {
        throw new ApiError(400, "Prescription can only be created after appointment completion");
    }
};

const checkExistingPrescription = async (appointmentId, session = null) => {
    const query = Prescription.findOne({ appointment: appointmentId, isDeleted: false });
    if (session) query.session(session);
    const prescription = await query;
    if (prescription) throw new ApiError(409, "Prescription already exists for this appointment");
};

const createPrescription = async (appointment, doctor, data, session) => {
    const prescriptions = await Prescription.create(
        [{
            appointment: appointment._id,
            patient: appointment.patient,
            doctor: doctor._id,
            diagnosis: data.diagnosis,
            notes: data.notes,
            medicines: data.medicines,
            followUpDate: data.followUpDate,
            followUpNotes: data.followUpNotes
        }],
        { session }
    );
    return prescriptions[0];
};

const populatePrescription = async (prescriptionId) => {
    return await Prescription.findById(prescriptionId)
        .populate({ path: "doctor", populate: { path: "user", select: "firstName lastName email" } })
        .populate({ path: "patient", populate: { path: "user", select: "firstName lastName email" } })
        .populate("appointment");
};

const createPrescriptionService = async (userId, prescriptionData) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const doctor = await findDoctor(userId, session);
        const appointment = await findAppointment(prescriptionData.appointmentId, session);
        validateAppointment(appointment, doctor);
        await checkExistingPrescription(appointment._id, session);
        const prescription = await createPrescription(appointment, doctor, prescriptionData, session);
        await session.commitTransaction();

        try {
            const patient = await Patient.findById(appointment.patient).select("user");
            if (patient) {
                await notificationService.createNotification({
                    recipient: patient.user,
                    title: "Prescription Ready",
                    message: "Your prescription is now available.",
                    type: NOTIFICATION_TYPES.PRESCRIPTION_CREATED,
                    metadata: { prescriptionId: prescription._id, appointmentId: appointment._id }
                });
            }
        } catch (err) {
            logger.error(err);
        }

        return await populatePrescription(prescription._id);
    } catch (error) {
        if (session.inTransaction()) await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const getMyPrescriptions = async (userId, query) => {
    const patient = await Patient.findOne({ user: userId });
    if (!patient) throw new ApiError(404, "Patient profile not found");
    const { page, limit, skip } = getPagination(query);
    const filter = { patient: patient._id, isDeleted: false };
    if (query.status) filter.status = query.status;

    const prescriptions = await Prescription.find(filter)
        .populate({ path: "doctor", populate: { path: "user", select: "firstName lastName" } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await Prescription.countDocuments(filter);
    return createPaginationResponse({ data: prescriptions, total, page, limit });
};

const getPrescriptionById = async (userId, role, prescriptionId) => {
    const prescription = await populatePrescription(prescriptionId);
    if (!prescription || prescription.isDeleted) throw new ApiError(404, "Prescription not found");
    ensurePrescriptionAccess(prescription, userId, role);
    return prescription;
};

const updatePrescription = async (userId, role, prescriptionId, data) => {
    const prescription = await populatePrescription(prescriptionId);
    if (!prescription || prescription.isDeleted) throw new ApiError(404, "Prescription not found");
    ensurePrescriptionAccess(prescription, userId, role);

    if (data.diagnosis !== undefined) prescription.diagnosis = data.diagnosis;
    if (data.notes !== undefined) prescription.notes = data.notes;
    if (data.medicines !== undefined) prescription.medicines = data.medicines;
    if (data.followUpDate !== undefined) prescription.followUpDate = data.followUpDate;
    if (data.followUpNotes !== undefined) prescription.followUpNotes = data.followUpNotes;
    if (data.status !== undefined) prescription.status = data.status;

    await prescription.save();
    return await populatePrescription(prescription._id);
};

const deletePrescription = async (userId, role, prescriptionId) => {
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) throw new ApiError(404, "Prescription not found");
    prescription.isDeleted = true;
    await prescription.save();
    return prescription;
};

const getDoctorPrescriptions = async (userId, query) => {
    const doctor = await findDoctor(userId);
    const { page, limit, skip } = getPagination(query);
    const filter = { doctor: doctor._id, isDeleted: false };
    if (query.status) filter.status = query.status;

    const prescriptions = await Prescription.find(filter)
        .populate({ path: "patient", populate: { path: "user", select: "firstName lastName email" } })
        .populate("appointment")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await Prescription.countDocuments(filter);
    return createPaginationResponse({ data: prescriptions, total, page, limit });
};

const getAllPrescriptions = async (query) => {
    const { page, limit, skip } = getPagination(query);
    const filter = { isDeleted: false };
    if (query.status) filter.status = query.status;

    const prescriptions = await Prescription.find(filter)
        .populate({ path: "doctor", populate: { path: "user", select: "firstName lastName email" } })
        .populate({ path: "patient", populate: { path: "user", select: "firstName lastName email" } })
        .populate("appointment")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await Prescription.countDocuments(filter);
    return createPaginationResponse({ data: prescriptions, total, page, limit });
};

module.exports = {
    createPrescriptionService,
    getMyPrescriptions,
    getDoctorPrescriptions,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
};
