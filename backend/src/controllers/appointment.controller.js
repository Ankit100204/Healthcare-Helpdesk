const appointmentService = require("../services/appointment.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Book Appointment
 */

const bookAppointment = asyncHandler(async (req, res) => {
    const appointments =
    await appointmentService.bookAppointment(
        req.user._id,
        req.body
    );
    return res.status(201).json(

        new ApiResponse(

            201,

            "Appointment booked successfully",

            appointments

        )

    );

});



/**
 * Get Logged In Patient Appointments
 */
const getMyAppointments=

asyncHandler(async(req,res)=>{

    const appointments=

    await appointmentService.getMyAppointments(

        req.user._id,

        req.query

    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Appointments fetched successfully",

            appointments

        )

    );

});

/**
 * Get Logged In Doctor Appointments
 */
const getDoctorAppointments = asyncHandler(async (req, res) => {
    const appointments =
        await appointmentService.getDoctorAppointments(
            req.user._id,

            req.query
        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Doctor appointments fetched successfully",

            appointments

        )

    );

});


/**
 * Get All Appointments (Admin)
 */
const getAllAppointments = asyncHandler(async (req, res) => {

    const appointments =
        await appointmentService.getAllAppointments();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Appointments fetched successfully",

            appointments

        )

    );

});

/**
 * Cancel Appointment
 */
const cancelAppointment = asyncHandler(async (req,res)=>{

    const appointment =

    await appointmentService.cancelAppointment(

        req.user._id,

        req.params.id,

        req.body.reason

    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Appointment cancelled successfully",

            appointment

        )

    );

});

/**
 * Reschedule Appointment
 */
const rescheduleAppointment = asyncHandler(async (req,res)=>{

    const appointment =

    await appointmentService.rescheduleAppointment(

        req.user._id,

        req.params.id,

        req.body.slotId

    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Appointment rescheduled successfully",

            appointment

        )

    );

});

/**
 * Update Appointment Status
 */
const updateAppointmentStatus = asyncHandler(async (req, res) => {

    const appointment =
        await appointmentService.updateAppointmentStatus(

            req.user._id,

            req.params.id,

            req.body.status

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Appointment status updated successfully",

            appointment

        )

    );

});

module.exports = {

    bookAppointment,

    getMyAppointments,

    getDoctorAppointments,

    getAllAppointments,

    cancelAppointment,

    rescheduleAppointment,

    updateAppointmentStatus

};