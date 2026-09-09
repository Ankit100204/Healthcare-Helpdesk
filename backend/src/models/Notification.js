const mongoose = require("mongoose");

const {
    NOTIFICATION_TYPES
} = require("../constants/notificationTypes");

const notificationSchema =
new mongoose.Schema({

    recipient: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true

    },

    title: {

        type: String,

        required: true,

        trim: true

    },

    message: {

        type: String,

        required: true,

        trim: true

    },

    type: {

        type: String,

        enum: Object.values(
            NOTIFICATION_TYPES
        ),

        required: true

    },

    isRead: {

        type: Boolean,

        default: false

    },

    metadata: {

        appointmentId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Appointment"

        },

        reportId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "MedicalReport"

        },

        prescriptionId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Prescription"

        }

    }

},{
    timestamps:true
});

notificationSchema.index({

    recipient:1,

    isRead:1,

    createdAt:-1

});

module.exports=
mongoose.model(
"Notification",
notificationSchema
);