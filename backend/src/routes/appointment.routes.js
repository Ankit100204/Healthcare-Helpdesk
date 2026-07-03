const express = require("express");

//const router = express.Router();
const router = express.Router();

router.use((req, res, next) => {
    console.log("Appointment Router:", req.method, req.originalUrl);
    next();
});



const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const { ROLES } = require("../constants/roles");

const {
    bookAppointment,
    getMyAppointments,
    getDoctorAppointments,
    getAllAppointments,
    cancelAppointment,
    updateAppointmentStatus,
    rescheduleAppointment
} = require("../controllers/appointment.controller");

const {
    bookAppointmentValidator,
    updateAppointmentStatusValidator,
    cancelAppointmentValidator,
    rescheduleAppointmentValidator
} = require("../validators/appointment.validator");

/*
Patient
*/

router.post(
    "/",
    protect,
    authorize(ROLES.PATIENT),
    bookAppointmentValidator,
    validate,
    bookAppointment
);

router.get(
    "/my",
    protect,
    authorize(ROLES.PATIENT),
    getMyAppointments
);

router.put(

"/:id/cancel",

protect,

authorize(ROLES.PATIENT),

cancelAppointmentValidator,

validate,

cancelAppointment

);

router.put(

"/:id/reschedule",

protect,

authorize(ROLES.PATIENT),

rescheduleAppointmentValidator,

validate,

rescheduleAppointment

);

/*
Doctor
*/

router.get(
    "/doctor",
    protect,
    authorize(ROLES.DOCTOR),
    getDoctorAppointments
);
router.put(
    "/:id/status",
    protect,
    authorize(ROLES.DOCTOR),
    updateAppointmentStatusValidator,
    validate,
    updateAppointmentStatus
);

/*
Admin
*/

router.get(
    "/",
    protect,
    authorize(ROLES.ADMIN),
    getAllAppointments
);

module.exports = router;