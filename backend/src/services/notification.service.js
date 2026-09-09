const Notification = require("../models/Notification");
const { getIO } = require("../config/socket");
const ApiError = require("../utils/ApiError");

const {
    getPagination,
    createPaginationResponse
} = require("../utils/pagination");


const createNotification = async ({

    recipient,

    title,

    message,

    type,

    metadata = {}

}) => {

    const notification = await Notification.create({

        recipient,

        title,

        message,

        type,

        metadata

    });
    try {

        const io = getIO();

        io.to(recipient.toString()).emit(
            "notification",
            notification
        );

    } catch (err) {

        console.error(
            "Socket notification failed:",
            err.message
        );

    }

    return notification;


};
const getMyNotifications = async (

    userId,

    query

) => {

    const {

        page,

        limit,

        skip

    } = getPagination(query);

    const filter = {

        recipient: userId

    };

    if (query.isRead !== undefined) {

        filter.isRead =
            query.isRead === "true";

    }

    const notifications =
        await Notification.find(filter)

            .sort({

                createdAt: -1

            })

            .skip(skip)

            .limit(limit);

    const total =
        await Notification.countDocuments(
            filter
        );

    return createPaginationResponse({

        data: notifications,

        total,

        page,

        limit

    });

};
const markAsRead = async (

    userId,

    notificationId

) => {

    const notification =
        await Notification.findOne({

            _id: notificationId,

            recipient: userId

        });

    if (!notification) {

        throw new ApiError(

            404,

            "Notification not found"

        );

    }

    notification.isRead = true;

    await notification.save();

    return notification;

};
const markAllAsRead = async (

    userId

) => {

    await Notification.updateMany(

        {

            recipient: userId,

            isRead: false

        },

        {

            $set: {

                isRead: true

            }

        }

    );

    return {

        message:

            "All notifications marked as read"

    };

};
const getUnreadCount = async (

    userId

) => {

    const count =
        await Notification.countDocuments({

            recipient: userId,

            isRead: false

        });

    return {

        unread: count

    };

};
module.exports = {

    createNotification,

    getMyNotifications,

    markAsRead,

    markAllAsRead,

    getUnreadCount

};