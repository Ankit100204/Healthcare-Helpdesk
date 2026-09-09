const { APPOINTMENT_STATUS } = require("./appointmentStatus");

const APPOINTMENT_TRANSITIONS = {

    [APPOINTMENT_STATUS.PENDING]: [
        APPOINTMENT_STATUS.CONFIRMED,
        APPOINTMENT_STATUS.REJECTED,
        APPOINTMENT_STATUS.CANCELLED
    ],

    [APPOINTMENT_STATUS.CONFIRMED]: [
        APPOINTMENT_STATUS.IN_PROGRESS,
        APPOINTMENT_STATUS.CANCELLED,
        APPOINTMENT_STATUS.NO_SHOW
    ],

    [APPOINTMENT_STATUS.IN_PROGRESS]: [
        APPOINTMENT_STATUS.COMPLETED
    ],

    [APPOINTMENT_STATUS.COMPLETED]: [],

    [APPOINTMENT_STATUS.REJECTED]: [],

    [APPOINTMENT_STATUS.CANCELLED]: [],

    [APPOINTMENT_STATUS.NO_SHOW]: []

};

const isValidTransition = (currentStatus, nextStatus) => {
    const allowed = APPOINTMENT_TRANSITIONS[currentStatus];
    return allowed ? allowed.includes(nextStatus) : false;
};

module.exports = {
    APPOINTMENT_TRANSITIONS,
    isValidTransition
};
