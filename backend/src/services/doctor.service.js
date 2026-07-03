//const mongoose = require("mongoose");

const User = require("../models/User");
const Doctor = require("../models/Doctor");

const ApiError = require("../utils/ApiError");
const { ROLES } = require("../constants/roles");

/**
 * Create Doctor
 */
const createDoctor = async (doctorData) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,

            specialization,
            qualification,
            experience,
            consultationFee,
            hospital,
            about,
            languages,
            availability,
            address,
            profileImage,
        } = doctorData;

        // Check Email
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            throw new ApiError(409, "Email already exists");
        }

        // Check Phone
        const existingPhone = await User.findOne({ phone });

        if (existingPhone) {
            throw new ApiError(409, "Phone number already exists");
        }

        // Create User
        const createdUser = await User.create(
          {
            firstName,
            lastName,
            email,
            phone,
            password,
            role: ROLES.DOCTOR,

            }
        );

        // const createdUser = createdUsers[0];

        // Create Doctor Profile
        const doctor = await Doctor.create({
            user: createdUser._id,
            specialization,
            qualification,
            experience,
            consultationFee,
            hospital,
            about,
            languages,
            availability,
            address,
            profileImage,
});

        // await session.commitTransaction();
        // session.endSession();

        return await Doctor.findById(doctor._id)
            .populate("user", "-password");

    } catch (error) {

        // await session.abortTransaction();
        // session.endSession();
        console.error("Create Doctor Error:", error);
        throw error;
    }
};

/**
 * Get All Doctors
 */
const getAllDoctors = async () => {

    return await Doctor.find()
        .populate(
            "user",
            "-password"
        )
        .sort({
            createdAt: -1,
        });

};

/**
 * Get Doctor By ID
 */
const getDoctorById = async (id) => {

    const doctor = await Doctor.findById(id)
        .populate(
            "user",
            "-password"
        );

    if (!doctor) {
        throw new ApiError(
            404,
            "Doctor not found"
        );
    }

    return doctor;

};

/**
 * Get Logged In Doctor Profile
 */
const getMyProfile = async (userId) => {

    const doctor = await Doctor.findOne({
        user: userId,
    }).populate(
        "user",
        "-password"
    );

    if (!doctor) {
        throw new ApiError(
            404,
            "Doctor profile not found"
        );
    }

    return doctor;

};

/**
 * Update Doctor Profile
 */
const updateDoctor = async (doctorId, updateData) => {

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
        throw new ApiError(
            404,
            "Doctor not found"
        );
    }

    const allowedFields = [
        "specialization",
        "qualification",
        "experience",
        "consultationFee",
        "hospital",
        "about",
        "languages",
        "availability",
        "address",
        "profileImage",
    ];

    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
            doctor[field] = updateData[field];
        }
    });

    await doctor.save();

    return await Doctor.findById(doctor._id)
        .populate(
            "user",
            "-password"
        );

};

/**
 * Delete Doctor
 */
const deleteDoctor = async (doctorId) => {

    // const session = await mongoose.startSession();

    // session.startTransaction();

    try {

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            throw new ApiError(
                404,
                "Doctor not found"
            );
        }

        await User.findByIdAndDelete(doctor.user);
        await Doctor.findByIdAndDelete(doctorId);

        // await session.commitTransaction();

        // session.endSession();

    } catch (error) {

        // await session.abortTransaction();

        // session.endSession();

        throw error;

    }

};

/**
 * Search Doctors
 */
const searchDoctors = async (query) => {

    const filter = {};

    if (query.specialization) {
        filter.specialization = query.specialization;
    }

    if (query.hospital) {
        filter.hospital = query.hospital;
    }

    if (query.experience) {
        filter.experience = {
            $gte: Number(query.experience),
        };
    }

    if (query.minFee || query.maxFee) {

        filter.consultationFee = {};

        if (query.minFee)
            filter.consultationFee.$gte = Number(query.minFee);

        if (query.maxFee)
            filter.consultationFee.$lte = Number(query.maxFee);
    }

    return await Doctor.find(filter)
        .populate(
            "user",
            "-password"
        );

};

module.exports = {

    createDoctor,

    getAllDoctors,

    getDoctorById,

    getMyProfile,

    updateDoctor,

    deleteDoctor,

    searchDoctors

};