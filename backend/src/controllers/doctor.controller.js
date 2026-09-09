const doctorService = require("../services/doctor.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createDoctor = asyncHandler(async (req, res) => {
    const doctor = await doctorService.createDoctor(req.body);
    return res.status(201).json(new ApiResponse(201, "Doctor created successfully", doctor));
});

const getAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await doctorService.getAllDoctors();
    return res.status(200).json(new ApiResponse(200, "Doctors fetched successfully", doctors));
});

const getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await doctorService.getDoctorById(req.params.id);
    return res.status(200).json(new ApiResponse(200, "Doctor fetched successfully", doctor));
});

const getMyProfile = asyncHandler(async (req, res) => {
    const doctor = await doctorService.getMyProfile(req.user._id);
    return res.status(200).json(new ApiResponse(200, "Doctor profile fetched successfully", doctor));
});

const updateDoctor = asyncHandler(async (req, res) => {
    const ApiError = require("../utils/ApiError");
    const DoctorModel = require("../models/Doctor");
    let doctorId = req.params.id;
    if (!doctorId) {
        const doctorDoc = await DoctorModel.findOne({ user: req.user._id });
        if (!doctorDoc) throw new ApiError(404, "Doctor profile not found");
        doctorId = doctorDoc._id;
    }
    const doctor = await doctorService.updateDoctor(doctorId, req.body);
    return res.status(200).json(new ApiResponse(200, "Doctor updated successfully", doctor));
});

const deleteDoctor = asyncHandler(async (req, res) => {
    await doctorService.deleteDoctor(req.params.id);
    return res.status(200).json(new ApiResponse(200, "Doctor deleted successfully"));
});

const searchDoctors = asyncHandler(async (req, res) => {
    const doctors = await doctorService.searchDoctors(req.query);
    return res.status(200).json(new ApiResponse(200, "Doctors fetched successfully", doctors));
});

const getDoctorDashboard = asyncHandler(async (req, res) => {
    const dashboard = await doctorService.getDoctorDashboard(req.user._id);
    return res.status(200).json(new ApiResponse(200, "Dashboard fetched successfully", dashboard));
});

module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    getMyProfile,
    updateDoctor,
    deleteDoctor,
    searchDoctors,
    getDoctorDashboard
};
