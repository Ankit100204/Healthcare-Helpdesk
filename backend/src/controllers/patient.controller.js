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

const updateProfile = asyncHandler(async (req, res) => {
    const patient = await patientService.updatePatientProfile(
        req.user._id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(200, "Patient profile updated successfully", patient)
    );
});

module.exports = {
    getProfile,
    updateProfile
};
