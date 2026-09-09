const mongoose = require("mongoose");

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const ApiError = require("../utils/ApiError");
const { ROLES } = require("../constants/roles");
const { APPOINTMENT_STATUS } = require("../constants/appointmentStatus");
const cacheService = require("./cache.service");
const logger = require("../config/logger");


/**
 * Create Doctor
 */
const createDoctor = async (doctorData) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

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
        const existingEmail = await User.findOne({ email }).session(session);

        if (existingEmail) {
            throw new ApiError(409, "Email already exists");
        }

        // Check Phone
        const existingPhone = await User.findOne({ phone }).session(session);

        if (existingPhone) {
            throw new ApiError(409, "Phone number already exists");
        }

        // Create User
        const createdUsers = await User.create(
            [
                {
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    role: ROLES.DOCTOR,
                },
            ],
            { session }
        );

        const createdUser = createdUsers[0];

        // Create Doctor Profile
        const doctors = await Doctor.create(
            [
                {
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
                },
            ],
            { session }
        );

        const doctor = doctors[0];

        await session.commitTransaction();

        // Invalidate cached doctor list so new doctors appear immediately
        await cacheService.delPattern("doctor:list*");

        return await Doctor.findById(doctor._id)
            .populate("user", "-password");

    } catch (error) {

        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;

    } finally {

        session.endSession();

    }
};

/**
 * Get All Doctors
 */
const getAllDoctors = async () => {

    return await cacheService.remember(

        "doctor:list",

        600,

        async () => {

            return await Doctor.find()

                .populate(
                    "user",
                    "-password"
                )

                .sort({
                    createdAt: -1
                });

        }

    );

};

/**
 * Get Doctor By ID
 */
const getDoctorById = async (id) => {

    return await cacheService.remember(

        `doctor:${id}`,

        600,

        async () => {

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

        }

    );

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
    await Promise.all([

        cacheService.del(
            `doctor:${doctor._id}`
        ),

        cacheService.delPattern(
            "doctor:list*"
        )

    ]);
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

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const doctor = await Doctor.findById(doctorId).session(session);

        if (!doctor) {
            throw new ApiError(
                404,
                "Doctor not found"
            );
        }
        const activeAppointment = await Appointment.findOne({
            doctor: doctorId,
            status: {
                $in: [
                    APPOINTMENT_STATUS.PENDING,
                    APPOINTMENT_STATUS.CONFIRMED,
                    APPOINTMENT_STATUS.IN_PROGRESS
                ]
            }
        }).session(session);

        if (activeAppointment) {
            throw new ApiError(
                400,
                "Doctor has active appointments and cannot be deleted"
            );
        }
        await User.findByIdAndDelete(
            doctor.user,
            { session }
        );

        await Doctor.findByIdAndDelete(
            doctorId,
            { session }
        );

        await session.commitTransaction();

        // Invalidate cached doctor list + this doctor's cached profile
        await Promise.all([

            cacheService.del(
                `doctor:${doctorId}`
            ),

            cacheService.delPattern(
                "doctor:list*"
            )

        ]);

        return {
            message: "Doctor deleted successfully"
        };

    } catch (error) {

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw error;

    } finally {

        session.endSession();

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

const getDoctorDashboard = async (
    userId
) => {
    const doctor = await Doctor.findOne({

        user: userId

    });

    if (!doctor) {

        throw new ApiError(

            404,

            "Doctor not found"

        );

    }
    const {

        startOfDay,

        endOfDay

    } = require("date-fns");
    const todayStart =
        startOfDay(new Date());

    const todayEnd =
        endOfDay(new Date());
    const dashboard = await Appointment.aggregate([
        {
            $match: {
                doctor: doctor._id
            }
        },
        {
            $facet: {

                todayAppointments: [

                    {
                        $match: {

                            appointmentStart: {

                                $gte: todayStart,

                                $lte: todayEnd

                            }

                        }

                    },

                    {

                        $count: "count"

                    }

                ],

                pendingAppointments: [

                    {

                        $match: {

                            status: "pending"

                        }

                    },

                    {

                        $count: "count"

                    }

                ],

                confirmedAppointments: [

                    {

                        $match: {

                            status: "confirmed"

                        }

                    },

                    {

                        $count: "count"

                    }

                ],

                completedAppointments: [

                    {

                        $match: {

                            status: "completed"

                        }

                    },

                    {

                        $count: "count"

                    }

                ],

                cancelledAppointments: [

                    {

                        $match: {

                            status: "cancelled"

                        }

                    },

                    {

                        $count: "count"

                    }

                ],

                upcomingAppointments: [

                    {

                        $match: {

                            appointmentStart: {

                                $gt: new Date()

                            }

                        }

                    },

                    {

                        $count: "count"

                    }

                ],

                recentAppointments: [

                    {

                        $sort: {

                            appointmentStart: -1

                        }

                    },

                    {

                        $limit: 5

                    },

                    {

                        $lookup: {

                            from: "patients",

                            localField: "patient",

                            foreignField: "_id",

                            as: "patient"

                        }

                    }

                ]

            }

        }

    ]);

    const result = dashboard[0];

    return {
        summary: {
            todayAppointments: result.todayAppointments[0]?.count || 0,
            pendingAppointments: result.pendingAppointments[0]?.count || 0,
            confirmedAppointments: result.confirmedAppointments[0]?.count || 0,
            completedAppointments: result.completedAppointments[0]?.count || 0,
            cancelledAppointments: result.cancelledAppointments[0]?.count || 0,
            upcomingAppointments: result.upcomingAppointments[0]?.count || 0
        },
        recentAppointments: result.recentAppointments
    };

};

module.exports = {

    createDoctor,

    getAllDoctors,

    getDoctorById,

    getMyProfile,

    updateDoctor,

    deleteDoctor,

    searchDoctors,
    getDoctorDashboard

};