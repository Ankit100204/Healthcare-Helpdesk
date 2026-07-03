const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    specialization: {
        type: String,
        required: true,
        index: true
    },

    qualification: {
        type: String,
        required: true
    },

    experience: {
        type: Number,
        default: 0
    },

    consultationFee: {
        type: Number,
        required: true
    },

    hospital: {
        type: String,
        required: true,
        index: true
    },

    about: {
        type: String,
        default: ""
    },

    languages: [
        String
    ],

    availability: [

        {

            day: String,

            startTime: String,

            endTime: String,

            isAvailable: Boolean

        }

    ],

    rating: {

        type:Number,

        default:0

    },

    totalReviews:{

        type:Number,

        default:0

    },

    totalPatients:{

        type:Number,

        default:0

    },

    profileImage:{

        type:String,

        default:""

    }

},{
    timestamps:true
});

module.exports = mongoose.model(
    "Doctor",
    doctorSchema
);