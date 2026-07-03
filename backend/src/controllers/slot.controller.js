const slotService = require("../services/slot.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Generate Slots
 */
const generateSlots = asyncHandler(async (req, res) => {

    const result = await slotService.generateSlots(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Slots generated successfully",
            result
        )
    );

});

/**
 * Get Available Slots
 */
const getAvailableSlots = asyncHandler(async (req, res) => {

    const { doctorId } = req.params;
    const { date } = req.query;

    const slots = await slotService.getAvailableSlots(
        doctorId,
        date
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Available slots fetched successfully",
            slots
        )
    );

});

/**
 * Get Slot By Id
 */
const getSlotById = asyncHandler(async (req, res) => {

    const slot = await slotService.getSlotById(
        req.params.slotId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Slot fetched successfully",
            slot
        )
    );

});

/**
 * Delete Slots
 */
const deleteSlots = asyncHandler(async (req, res) => {

    const result = await slotService.deleteSlots(
        req.params.doctorId,
        req.query.date
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Slots deleted successfully",
            result
        )
    );

});

module.exports = {

    generateSlots,

    getAvailableSlots,

    getSlotById,

    deleteSlots

};