const mongoose = require("mongoose");

const { APPOINTMENT_STATUS } = require("../constants/appointmentStatus");

const appointmentSchema = new mongoose.Schema({

    patient:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Patient",

        required:true

    },

    doctor:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Doctor",

        required:true

    },

    slot:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"AppointmentSlot",

        required:true

    },

    reason:String,

    symptoms:[String],

    notes:String,

    status:{

        type:String,

        enum:Object.values(APPOINTMENT_STATUS),

        default:APPOINTMENT_STATUS.PENDING

    },
    appointmentStart: {
    type: Date,
    required: true,
    index: true
    },

    appointmentEnd: {
        type: Date,
        required: true
    },
    cancelledBy: {
        type: String,
        enum: ["patient", "doctor", "admin"]
    },
    confirmedAt: {
    type: Date
    },

    startedAt: {
        type: Date
    },

    completedAt: {
        type: Date
    },

    cancelledAt: {
        type: Date
    },

    rejectedAt: {
        type: Date
    },
    cancelReason: {
    type: String,
    default: ""
    },

    cancelledBy: {
        type: String,
        enum: ["Patient", "Doctor", "Admin"],
        default: null
    },

    cancelledAt: {
        type: Date
    },

},{
    timestamps:true
});
appointmentSchema.index({ patient: 1 });

appointmentSchema.index({ doctor: 1 });

appointmentSchema.index({ slot: 1 });

appointmentSchema.index({ status: 1 });

appointmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model(
    "Appointment",
    appointmentSchema
);