import { Link } from "react-router-dom";

const statusStyles = {
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-slate-200 text-slate-700",
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-green-100 text-green-700",
};

const AppointmentCard = ({ appointment, onCancel }) => {
    return (
        <div className="rounded-xl bg-white p-5 shadow">

            <h2 className="font-semibold text-lg">
                Dr. {appointment.doctor?.user?.firstName || "Unknown"} {appointment.doctor?.user?.lastName || ""}
            </h2>

            <p className="text-gray-500">
                {appointment.doctor?.specialization || "General consultation"}
            </p>

            <p className="mt-3">
                {appointment.appointmentStart
                    ? new Date(appointment.appointmentStart).toLocaleString()
                    : "Date unavailable"}
            </p>

            <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm capitalize ${statusStyles[appointment.status] || "bg-blue-100 text-blue-700"}`}>
                {appointment.status}
            </span>

            <div className="mt-4 flex flex-wrap gap-3">
                <Link to={`/patient/appointments/${appointment._id}`} className="font-medium text-blue-600 hover:underline">
                    View details
                </Link>
                {!["cancelled", "completed", "rejected"].includes(appointment.status) && (
                    <button onClick={() => onCancel(appointment)} className="font-medium text-red-600 hover:underline">
                        Cancel appointment
                    </button>
                )}
            </div>

        </div>
    );
};

export default AppointmentCard;
