const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const { ROLES } = require("../constants/roles");

const {

    generateSlots,

    getAvailableSlots,

    getSlotById,

    deleteSlots

} = require("../controllers/slot.controller");

const {
    generateSlotValidator
} = require("../validators/slot.validator");

/**
 * Generate Slots
 * Admin Only
 */
router.post(
    "/generate",
    protect,
    authorize(ROLES.ADMIN),
    generateSlotValidator,
    validate,
    generateSlots
);

/**
 * Get Available Slots
 * Public
 */
router.get(
    "/doctor/:doctorId",
    getAvailableSlots
);

/**
 * Slot Details
 */
router.get(
    "/details/:slotId",
    getSlotById
);

/**
 * Delete Future Slots
 */
router.delete(
    "/doctor/:doctorId",
    protect,
    authorize(ROLES.ADMIN),
    deleteSlots
);

module.exports = router;