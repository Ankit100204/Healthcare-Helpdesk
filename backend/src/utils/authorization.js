const ApiError = require("./ApiError");
const { ROLES } = require("../constants/roles");

const ensureReportAccess = (
    report,
    userId,
    role
) => {

    if (role === ROLES.ADMIN) {
        return;
    }

    if (
        role === ROLES.DOCTOR &&
        report.doctor.user._id.toString() === userId.toString()
    ) {
        return;
    }

    if (
    role === ROLES.PATIENT &&
        report.patient.user._id.toString() === userId.toString()
    ) {
        return;
    }

    throw new ApiError(
        403,
        "You are not authorized to access this report"
    );

};

module.exports = {
    ensureReportAccess
};