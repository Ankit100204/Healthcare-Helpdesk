const Patient = require("../models/Patient");
const ApiError = require("../utils/ApiError");

const getPatientProfile = async (userId) => {

    const patient = await Patient.findOne({
        user: userId
    }).populate(
        "user",
        "-password"
    );

    if (!patient) {
        throw new ApiError(
            404,
            "Patient profile not found"
        );
    }

    return patient;

};

const updatePatientProfile = async (userId, data) => {

    const patient = await Patient.findOne({
        user: userId
    });

    if (!patient) {
        throw new ApiError(
            404,
            "Patient profile not found"
        );
    }
    const allowedFields = [
    "gender",
    "dateOfBirth",
    "bloodGroup",
    "height",
    "weight",
    "allergies",
    "chronicDiseases",
    "emergencyContact",
    "address"
];

allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
        patient[field] = data[field];
    }
});

    /* Object.assign(patient, data); */

    await patient.save();

    return patient;

};


module.exports = {
    getPatientProfile,
    updatePatientProfile
};