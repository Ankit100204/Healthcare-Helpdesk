const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const patientService = require("../services/patient.service");

const getProfile = asyncHandler(async (req, res) => {

    const patient = await patientService.getPatientProfile(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Patient profile fetched successfully",
            patient
        )
    );

});

const updateProfile = async (req, res) => {
    try {
        const patient = await patientService.updatePatientProfile(
            req.user.id,
            req.body
        );

        res.json({
            success: true,
            data: patient
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    getProfile,
    updateProfile
};