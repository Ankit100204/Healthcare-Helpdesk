const express = require("express");

const router = express.Router();

const notificationController =
require("../controllers/notification.controller");

const protect =
require("../middleware/auth.middleware");

const validate =
require("../middleware/validate.middleware");

const {
    notificationIdValidator
} =
require("../validators/notification.validator");


router.use(protect);

router.get( "/", notificationController.getMyNotifications);
router.get(
    "/unread-count",
    notificationController.getUnreadCount
);
router.put(
    "/read-all",
    notificationController.markAllAsRead
);
router.put(
    "/:id/read",
    notificationIdValidator,
    validate,
    notificationController.markAsRead
);
module.exports = router;