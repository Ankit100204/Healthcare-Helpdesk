const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },

    dateOfBirth: Date,

    bloodGroup: {
        type: String,
        enum: [
            "A+","A-",
            "B+","B-",
            "AB+","AB-",
            "O+","O-"
        ]
    },

    height: Number,

    weight: Number,

    allergies: [
        String
    ],

    chronicDiseases: [
        String
    ],

    emergencyContact: {

        name: String,

        relation: String,

        phone: String

    },

    address: {

        street: String,

        city: String,

        state: String,

        pincode: String

    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Patient",
    patientSchema
);