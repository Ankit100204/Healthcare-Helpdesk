const mongoose = require("mongoose");

const {
    EMERGENCY_STATUS
} = require("../constants/emergencyStatus");

const {
    EMERGENCY_TYPES
} = require("../constants/emergencyTypes");

const emergencySchema = new mongoose.Schema({

    patient: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Patient",

        required: true,

        index: true

    },

    doctor: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Doctor"

    },

    emergencyType: {

        type: String,

        enum: Object.values(
            EMERGENCY_TYPES
        ),

        required: true

    },

    description: {

        type: String,

        trim: true,

        default: ""

    },

    status: {

        type: String,

        enum: Object.values(
            EMERGENCY_STATUS
        ),

        default:
            EMERGENCY_STATUS.PENDING

    },

    location: {

        type: {

            type: String,

            enum: ["Point"],

            default: "Point"

        },

        coordinates: {

            type: [Number],

            required: true

        }

    },

    acceptedAt: Date,

    arrivedAt: Date,

    completedAt: Date,

    cancelledAt: Date

},{
    timestamps:true
});

emergencySchema.index({
    location:"2dsphere"
});

module.exports=
mongoose.model(
"Emergency",
emergencySchema
);