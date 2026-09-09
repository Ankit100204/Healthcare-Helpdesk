const notificationService = require("../services/notification.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const getMyNotifications = asyncHandler(async (req, res) => {

    const notifications =
        await notificationService.getMyNotifications(
            req.user._id,
            req.query
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Notifications fetched successfully",
            notifications
        )
    );

});
const markAsRead = asyncHandler(async (req, res) => {

    const notification =
        await notificationService.markAsRead(
            req.user._id,
            req.params.id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Notification marked as read",
            notification
        )
    );

});
const markAllAsRead = asyncHandler(async (req, res) => {

    const result =
        await notificationService.markAllAsRead(
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            result.message,
            null
        )
    );

});
const getUnreadCount = asyncHandler(async (req, res) => {

    const count =
        await notificationService.getUnreadCount(
            req.user._id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Unread count fetched successfully",
            count
        )
    );

});
module.exports = {

    getMyNotifications,

    markAsRead,

    markAllAsRead,

    getUnreadCount

};