const mongoose = require("mongoose");

const {
    MEDICINE_FREQUENCY
} = require("../constants/medicineFrequency");

const medicineSchema = new mongoose.Schema(

    {

        medicineName: {

            type: String,

            required: true,

            trim: true

        },

        dosage: {

            type: String,

            required: true,

            trim: true

        },

        frequency: {

            type: String,

            enum: Object.values(
                MEDICINE_FREQUENCY
            ),

            required: true

        },

        duration: {

            type: String,

            required: true,

            trim: true

        },

        instructions: {

            type: String,

            trim: true,

            default: ""

        }

    },

    {
        _id: false
    }

);

const prescriptionSchema = new mongoose.Schema(

    {

        appointment: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Appointment",

            required: true,

            unique: true,

            index: true

        },

        patient: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Patient",

            required: true,

            index: true

        },

        doctor: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Doctor",

            required: true,

            index: true

        },

        diagnosis: {

            type: String,

            required: true,

            trim: true

        },

        notes: {

            type: String,

            trim: true,

            default: ""

        },

        medicines: {

            type: [medicineSchema],

            validate: {

                validator(value) {

                    return value.length > 0;

                },

                message:
                    "Prescription must contain at least one medicine"

            }

        },

        followUpDate: {

            type: Date

        },

        followUpNotes: {

            type: String,

            trim: true,

            default: ""

        },

        status: {

            type: String,

            enum: [

                "active",

                "completed",

                "expired"

            ],

            default: "active"

        },

        isDeleted: {

            type: Boolean,

            default: false

        }

    },

    {

        timestamps: true

    }

);

prescriptionSchema.index({

    doctor: 1,

    createdAt: -1

});

prescriptionSchema.index({

    patient: 1,

    createdAt: -1

});

module.exports = mongoose.model(

    "Prescription",

    prescriptionSchema

);