const mongoose = require("mongoose");

const appointmentSlotSchema = new mongoose.Schema(
{
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
        index: true
    },

    slotStart: {
        type: Date,
        required: true,
        index: true
    },

    slotEnd: {
        type: Date,
        required: true
    },

    isBooked: {
        type: Boolean,
        default: false
    },

    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        default: null
    }

},
{
    timestamps: true
});

// Prevent duplicate slots
appointmentSlotSchema.index(
    {
        doctor: 1,
        slotStart: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "AppointmentSlot",
    appointmentSlotSchema
);