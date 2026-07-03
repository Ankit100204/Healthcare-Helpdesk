const doctorService = require("../services/doctor.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Create Doctor
 */
const createDoctor = asyncHandler(async (req, res) => {

    const doctor = await doctorService.createDoctor(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Doctor created successfully",
            doctor
        )
    );

});

/**
 * Get All Doctors
 */
const getAllDoctors = asyncHandler(async (req, res) => {

    const doctors = await doctorService.getAllDoctors();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Doctors fetched successfully",
            doctors
        )
    );

});

/**
 * Get Doctor By Id
 */
const getDoctorById = asyncHandler(async (req, res) => {

    const doctor = await doctorService.getDoctorById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Doctor fetched successfully",
            doctor
        )
    );

});

/**
 * Get Logged In Doctor Profile
 */
const getMyProfile = asyncHandler(async (req, res) => {

    const doctor = await doctorService.getMyProfile(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Doctor profile fetched successfully",
            doctor
        )
    );

});

/**
 * Update Doctor
 */
const updateDoctor = asyncHandler(async (req, res) => {

    const doctor = await doctorService.updateDoctor(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Doctor updated successfully",
            doctor
        )
    );

});

/**
 * Delete Doctor
 */
const deleteDoctor = asyncHandler(async (req, res) => {

    await doctorService.deleteDoctor(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Doctor deleted successfully"
        )
    );

});

/**
 * Search Doctors
 */
const searchDoctors = asyncHandler(async (req, res) => {

    const doctors = await doctorService.searchDoctors(req.query);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Doctors fetched successfully",
            doctors
        )
    );

});

module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    getMyProfile,
    updateDoctor,
    deleteDoctor,
    searchDoctors
};