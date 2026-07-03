const mapAppointment = (appointment) => ({
    id: appointment._id,
    status: appointment.status,
    start: appointment.appointmentStart,
    end: appointment.appointmentEnd,
    doctor: {
        name: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`
    }
});