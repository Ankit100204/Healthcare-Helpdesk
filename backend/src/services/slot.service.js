const AppointmentSlot = require("../models/AppointmentSlot");
const Doctor = require("../models/Doctor");
const ApiError = require("../utils/ApiError");

const {
    addMinutes,
    parseISO,
    startOfDay,
    endOfDay,
    isBefore
} = require("date-fns");

/**
 * Generate Appointment Slots
 */
const generateSlots = async ({
    doctorId,
    date,
    startTime,
    endTime,
    slotDuration = 30
}) => {

    // -----------------------------
    // Validate Doctor
    // -----------------------------
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
    }

    // -----------------------------
    // Convert to Date Objects
    // -----------------------------
    const workStart = parseISO(`${date}T${startTime}:00`);
    const workEnd = parseISO(`${date}T${endTime}:00`);

    if (workStart >= workEnd) {
        throw new ApiError(
            400,
            "Start time must be before end time"
        );
    }

    // -----------------------------
    // Generate Slots In Memory
    // -----------------------------
    const generatedSlots = [];

    let current = workStart;

    while (isBefore(current, workEnd)) {

        const slotEnd = addMinutes(
            current,
            slotDuration
        );

        if (slotEnd > workEnd) {
            break;
        }

        generatedSlots.push({
            doctor: doctorId,
            slotStart: current,
            slotEnd,
            isBooked: false
        });

        current = slotEnd;
    }

    // -----------------------------
    // Fetch Existing Slots (ONE QUERY)
    // -----------------------------
    const existingSlots = await AppointmentSlot.find({

        doctor: doctorId,

        slotStart: {
            $gte: startOfDay(workStart),
            $lte: endOfDay(workStart)
        }

    }).select("slotStart");

    const existingSlotSet = new Set(

        existingSlots.map(slot =>
            slot.slotStart.getTime()
        )

    );

    // -----------------------------
    // Remove Duplicates
    // -----------------------------
    const newSlots = generatedSlots.filter(slot =>

        !existingSlotSet.has(
            slot.slotStart.getTime()
        )

    );

    if (newSlots.length === 0) {

        return {

            totalGenerated: generatedSlots.length,

            inserted: 0,

            message: "All slots already exist"

        };

    }

    // -----------------------------
    // Bulk Insert
    // -----------------------------
    const insertedSlots = await AppointmentSlot.insertMany(
        newSlots,
        {
            ordered: false
        }
    );

    return {

        totalGenerated: generatedSlots.length,

        inserted: insertedSlots.length,

        slots: insertedSlots

    };

};

/**
 * Generate Slots For Logged In Doctor
 */
const generateDoctorSlots = async (userId, data) => {
    const doctor = await Doctor.findOne({ user: userId });

    if (!doctor) {
        throw new ApiError(404, "Doctor profile not found");
    }

    return await generateSlots({
        doctorId: doctor._id,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        slotDuration: data.slotDuration
    });
};

/**
 * Get Logged In Doctor Slots
 */
const getDoctorSlots = async (userId, date) => {
    const doctor = await Doctor.findOne({ user: userId });

    if (!doctor) {
        throw new ApiError(404, "Doctor profile not found");
    }

    const query = { doctor: doctor._id };

    if (date) {
        query.slotStart = {
            $gte: startOfDay(new Date(date)),
            $lte: endOfDay(new Date(date))
        };
    } else {
        query.slotStart = {
            $gte: startOfDay(new Date())
        };
    }

    const slots = await AppointmentSlot.find(query).sort({ slotStart: 1 });

    return slots;
};

/**
 * Get Available Slots Of Doctor
 */
const getAvailableSlots = async (
    doctorId,
    date
) => {

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
        throw new ApiError(
            404,
            "Doctor not found"
        );
    }

    const slots = await AppointmentSlot.find({

        doctor: doctorId,

        isBooked: false,

        slotStart: {
            $gte: startOfDay(new Date(date)),
            $lte: endOfDay(new Date(date)),
            $gt: new Date()
        }

    })
        .sort({
            slotStart: 1
        });

    return slots;

};

/**
 * Get Slot By Id
 */
const getSlotById = async (slotId) => {

    const slot = await AppointmentSlot.findById(slotId)
        .populate({
            path: "doctor",
            populate: {
                path: "user",
                select: "-password"
            }
        });

    if (!slot) {

        throw new ApiError(
            404,
            "Slot not found"
        );

    }

    return slot;

};

/**
 * Delete Future Slots
 */
const deleteSlots = async (
    doctorId,
    date
) => {

    const result = await AppointmentSlot.deleteMany({

        doctor: doctorId,

        isBooked: false,

        slotStart: {
            $gte: startOfDay(new Date(date))
        }

    });

    return {

        deleted: result.deletedCount

    };

};

module.exports = {

    generateSlots,

    generateDoctorSlots,

    getDoctorSlots,

    getAvailableSlots,

    getSlotById,

    deleteSlots

};
