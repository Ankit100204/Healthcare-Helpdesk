const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");
const AppointmentSlot = require("../models/AppointmentSlot");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const { NOTIFICATION_TYPES } = require("../constants/notificationTypes");
const ApiError = require("../utils/ApiError");
const { CANCELLED_BY }=require("../constants/cancelledBy")
const { APPOINTMENT_STATUS } = require("../constants/appointmentStatus");
const { APPOINTMENT_TRANSITIONS } = require("../constants/appointmentTransitions");
const notificationService = require("./notification.service");
const {getPagination} = require("../utils/pagination")
const findPatient = async (userId, session) => {

    const patient = await Patient.findOne({
        user: userId
    })
    .populate("user", "firstName lastName email phone")
    .session(session);

    if (!patient) {
        throw new ApiError(
            404,
            "Patient profile not found"
        );
    }

    return patient;
};
const reserveSlot = async (slotId, session) => {
    const slot = await AppointmentSlot.findOneAndUpdate(
        {
            _id: slotId,
            isBooked: false,
            slotStart: {
                $gt: new Date()
            }
        },
        {
            $set: {
                isBooked: true
            }
        },
        {
            new: true,
            session
        }
    );
    console.log("Reserved Slot:", slot);
    if (!slot) {
        throw new ApiError(
            409,
            "Slot is unavailable or already booked"
        );
    }

    return slot;
};
const findDoctor = async (doctorId, session) => {

    const doctor = await Doctor.findById(
        doctorId
    )
    .populate("user","firstName lastName email")
    .session(session);

    if (!doctor) {
        throw new ApiError(
            404,
            "Doctor not found"
        );
    }

    return doctor;
};
const createAppointment = async (
    patient,
    doctor,
    slot,
    reason,
    symptoms,
    session
) => {

    const appointments = await Appointment.create(
        [
            {
                patient: patient._id,
                doctor: doctor._id,
                slot: slot._id,
                appointmentStart: slot.slotStart,
                appointmentEnd: slot.slotEnd,
                reason,
                symptoms,
                status: APPOINTMENT_STATUS.PENDING
            }
        ],
        {
            session
        }
    );

    return appointments[0];
};
const populateAppointment = async (appointmentId) => {

    return await Appointment.findById(appointmentId)
        .populate({
            path: "patient",
            populate: {
                path: "user",
                select: "-password"
            }
        })
        .populate({
            path: "doctor",
            populate: {
                path: "user",
                select: "-password"
            }
        })
        .populate("slot");
};
const bookAppointment = async (userId, data) => {
    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const {
            slotId,
            reason,
            symptoms = []
        } = data;

        // Find Patient
        const patient = await findPatient(
            userId,
            session
        );
       
        // Reserve Slot
        const slot = await reserveSlot(
            slotId,
            session
        );
        
        // Find Doctor
        const doctor = await findDoctor(
            slot.doctor,
            session
        );
        
        // Create Appointment
        const appointment = await createAppointment(
            patient,
            doctor,
            slot,
            reason,
            symptoms,
            session
        );
        // Link Appointment to Slot
        await AppointmentSlot.updateOne(
            { _id: slot._id },
            {
                $set: {
                    appointment: appointment._id
                }
            },
            { session }
        );

        // Commit Transaction
        await session.commitTransaction();

        // Send Notifications (Do NOT fail booking if notification fails)
        try {

            await notificationService.createNotification({

                recipient: patient.user,

                title: "Appointment Booked",

                message:
                    `Your appointment with Dr. ${doctor.user.firstName} has been booked successfully.`,

                type: NOTIFICATION_TYPES.APPOINTMENT_BOOKED,

                metadata: {
                    appointmentId: appointment._id
                }

            });

            await notificationService.createNotification({

                recipient: doctor.user,

                title: "New Appointment",

                message:
                    "A new patient has booked an appointment.",

                type: NOTIFICATION_TYPES.APPOINTMENT_BOOKED,

                metadata: {
                    appointmentId: appointment._id
                }

            });

        } catch (notificationError) {

            console.error(
                "Notification Error:",
                notificationError
            );

        }

        return await populateAppointment(
            appointment._id
        );

    } catch (error) {
         if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw error;

    } finally {

        session.endSession();

    }

};


const getMyAppointments = async (
    userId,
    query
) => {
const patient = await Patient.findOne({
    user: userId
});

if (!patient) {

    throw new ApiError(
        404,
        "Patient profile not found"
    );

}
const {

    status,

    type,

    sort = "asc",

    from,

    to

} = query;
// pagination
const {
    page,
    limit,
    skip
} = getPagination(query);
const filter = {

    patient: patient._id

};
if (status) {

    filter.status = status;

}
if (type === "upcoming") {

    filter.appointmentStart = {
        $gte: new Date()
    };

}

if (type === "past") {

    filter.appointmentStart = {
        $lt: new Date()
    };

}
if(from || to){

    filter.appointmentStart={

        ...(filter.appointmentStart || {})

    };

    if(from){

        filter.appointmentStart.$gte=

        new Date(from);

    }

    if(to){

        filter.appointmentStart.$lte=

        new Date(to);

    }

}


const appointments =

await Appointment.find(filter)

.populate({

path:"doctor",

populate:{

path:"user",

select:"firstName lastName email phone"

}

})

.populate("slot")

.sort({

appointmentStart:

sort==="desc"

?

-1

:

1

})

.skip(skip)

.limit(limit)

.lean();


const total = await Appointment.countDocuments(
    filter
);

return {

    total,

    page,

    limit,

    totalPages: Math.ceil(total / limit),

    appointments

};
};
const getDoctorAppointments = async (

userId,

query

) => {
    console.log("Service reached");
    const doctor = await Doctor.findOne({

        user:userId

        });

        if(!doctor){

        throw new ApiError(

        404,

        "Doctor profile not found"

        );

    }
    const{

page=1,

limit=10,

status,

type,

sort="asc",

from,

to

}=query;
const pageNumber=Number(page);

const pageSize=Number(limit);

const skip=(pageNumber-1)*pageSize;
const filter={

doctor:doctor._id

};
if(status){

filter.status=status;

}
if(type==="upcoming"){

filter.appointmentStart={

$gte:new Date()

};

}
if(type==="past"){

filter.appointmentStart={

$lt:new Date()

};

}
const { startOfDay, endOfDay } = require("date-fns");

if(type==="today"){

filter.appointmentStart={

$gte:startOfDay(new Date()),

$lte:endOfDay(new Date())

};

}

if(from || to){

filter.appointmentStart={

...(filter.appointmentStart||{})

};

if(from){

filter.appointmentStart.$gte=

new Date(from);

}

if(to){

filter.appointmentStart.$lte=

new Date(to);

}

}

const appointments=

await Appointment.find(filter)

.populate({

path:"patient",

populate:{

path:"user",

select:"firstName lastName phone email"

}

})

.populate("slot")

.sort({

appointmentStart:

sort==="desc"

?

-1

:

1

})

.skip(skip)

.limit(pageSize)

.lean();

const total=

await Appointment.countDocuments(
filter
);
return{

total,

page:pageNumber,

limit:pageSize,

totalPages:

Math.ceil(total/pageSize),

appointments

};


};
const updateAppointmentStatus = async (
    userId,
    appointmentId,
    status
) => {

    const doctor = await Doctor.findOne({
        user: userId
    });

    if (!doctor) {
        throw new ApiError(
            404,
            "Doctor profile not found"
        );
    }

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        doctor: doctor._id
    })
    .populate({
    path: "patient",
    populate: {
        path: "user",
        select: "firstName lastName email phone"
    }
    });

    if (!appointment) {
        throw new ApiError(
            404,
            "Appointment not found"
        );
    }

    const allowedTransitions =
        APPOINTMENT_TRANSITIONS[appointment.status];

    if (!allowedTransitions.includes(status)) {

        throw new ApiError(
            400,
            `Cannot change appointment status from '${appointment.status}' to '${status}'`
        );

    }

    appointment.status = status;
    switch (status) {

    case APPOINTMENT_STATUS.CONFIRMED:
        appointment.confirmedAt = new Date();
        await notificationService.createNotification({

            recipient: appointment.patient.user._id,

            title: "Appointment Confirmed",

            message:
                "Your appointment has been confirmed by the doctor.",

            type:
                NOTIFICATION_TYPES.APPOINTMENT_CONFIRMED,

            metadata: {

                appointmentId: appointment._id

            }

        });
        break;

    case APPOINTMENT_STATUS.IN_PROGRESS:
        appointment.startedAt = new Date();
        break;

    case APPOINTMENT_STATUS.COMPLETED:
        appointment.completedAt = new Date();
        break;

    case APPOINTMENT_STATUS.REJECTED:
        appointment.rejectedAt = new Date();
        break;
}

    await appointment.save();

    return populateAppointment(
        appointment._id
    );

};

const cancelAppointment = async (
    userId,
    appointmentId,
    reason
) => {

    const patient = await Patient.findOne({
        user: userId
    });

    if (!patient) {
        throw new ApiError(
            404,
            "Patient not found"
        );
    }

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: patient._id
    });

    if (!appointment) {
        throw new ApiError(
            404,
            "Appointment not found"
        );
    }

    if (
        appointment.status === APPOINTMENT_STATUS.COMPLETED
    ) {
        throw new ApiError(
            400,
            "Completed appointment cannot be cancelled"
        );
    }

    if (
        appointment.status === APPOINTMENT_STATUS.CANCELLED
    ) {
        throw new ApiError(
            400,
            "Appointment already cancelled"
        );
    }

    const now = new Date();

    const minutes =
        (appointment.appointmentStart - now) / (1000 * 60);

    if (minutes < 30) {
        throw new ApiError(
            400,
            "Appointment cannot be cancelled within 30 minutes"
        );
    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        appointment.status = APPOINTMENT_STATUS.CANCELLED;
        appointment.cancelReason = reason;
        appointment.cancelledBy = CANCELLED_BY.PATIENT;;
        appointment.cancelledAt = new Date();

        await appointment.save({ session });

        await AppointmentSlot.updateOne(
            {
                _id: appointment.slot
            },
            {
                $set: {
                    isBooked: false,
                    appointment: null
                }
            },
            {
                session
            }
        );

        await session.commitTransaction();
        await notificationService.createNotification({

            recipient: patient.user,

            title: "Appointment Cancelled",

            message:
                "Your appointment has been cancelled.",

            type:
                NOTIFICATION_TYPES.APPOINTMENT_CANCELLED,

            metadata: {

                appointmentId: appointment._id

            }

        });
        return await populateAppointment(
            appointment._id
        );

    } catch (error) {

        if (session.inTransaction()) {
        await session.abortTransaction();
    }
        throw error;

    } finally {

        session.endSession();

    }
};

const rescheduleAppointment = async (

userId,

appointmentId,

newSlotId

)=>{
const patient = await Patient.findOne({

user:userId

});

if(!patient){

throw new ApiError(

404,

"Patient not found"

);

}
const appointment = await Appointment.findOne({

_id:appointmentId,

patient:patient._id

});
if (!appointment) {
    throw new ApiError(
        404,
        "Appointment not found"
    );
}

if(

appointment.status!==APPOINTMENT_STATUS.PENDING &&

appointment.status!==APPOINTMENT_STATUS.CONFIRMED

){

throw new ApiError(

400,

"Appointment cannot be rescheduled"

);

}
const session=

await mongoose.startSession();


try{
    session.startTransaction();
    const slot = await AppointmentSlot.findOneAndUpdate(
    {
        _id: newSlotId,
        isBooked: false,
        slotStart: { $gt: new Date() }
    },
    {
        $set: {
            isBooked: true
        }
    },
    {
        new: true,
        session
    }
);

if (!slot) {
    throw new ApiError(
        404,
        "New slot is unavailable or already booked"
    );
}
    await AppointmentSlot.updateOne(

{

_id:appointment.slot

},

{

$set:{

isBooked:false,

appointment:null

}

},

{

session

}

);
appointment.slot=

slot._id;

appointment.doctor=

slot.doctor;

appointment.appointmentStart=

slot.slotStart;

appointment.appointmentEnd=

slot.slotEnd;

appointment.status=

APPOINTMENT_STATUS.PENDING;
await appointment.save({

session

});
await AppointmentSlot.updateOne(
    {
        _id: slot._id
    },
    {
        $set: {
            isBooked: true,
            appointment: appointment._id
        }
    },
    {
        session
    }
);
await session.commitTransaction();


return populateAppointment(

appointment._id

);
} catch(error){

await session.abortTransaction();

throw error;

} finally{
    session.endSession();
}

};
const getAllAppointments = async () => {

    const appointments = await Appointment.find()
        .populate({
            path: "patient",
            populate: {
                path: "user",
                select: "firstName lastName email phone"
            }
        })
        .populate({
            path: "doctor",
            populate: {
                path: "user",
                select: "firstName lastName email phone"
            }
        })
        .populate("slot")
        .sort({ appointmentStart: -1 });

    return appointments;
};

module.exports = {
    getMyAppointments,
    bookAppointment,
    getDoctorAppointments,
    updateAppointmentStatus,
    cancelAppointment,
    rescheduleAppointment,
    getAllAppointments
};