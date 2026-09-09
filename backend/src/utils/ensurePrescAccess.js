const ApiError = require("./ApiError");
const { ROLES } = require("../constants/roles");

const ensurePrescriptionAccess = (
    prescription,
    userId,
    role
) => {

    if (role === ROLES.ADMIN) {
        return;
    }

    const doctorUserId =
        prescription.doctor.user._id ||
        prescription.doctor.user;

    const patientUserId =
        prescription.patient.user._id ||
        prescription.patient.user;

    if (
        role === ROLES.DOCTOR &&
        doctorUserId.toString() === userId.toString()
    ) {
        return;
    }

    if (
        role === ROLES.PATIENT &&
        patientUserId.toString() === userId.toString()
    ) {
        return;
    }

    throw new ApiError(
        403,
        "You are not authorized to access this prescription"
    );

};

module.exports = {
    ensurePrescriptionAccess
};