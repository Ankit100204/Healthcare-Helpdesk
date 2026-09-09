import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getAppointments } from "../services/patientService";

const AppointmentDetails = () => {
    const { id } = useParams();
    const { data, isLoading, isError } = useQuery({ queryKey: ["appointment-details", id], queryFn: () => getAppointments({ limit: 100 }) });
    const appointment = data?.data?.appointments?.find((item) => item._id === id);

    return <DashboardLayout><Link to="/patient/appointments" className="font-medium text-blue-600 hover:underline">← Back to appointments</Link>{isLoading && <p className="mt-6">Loading appointment...</p>}{isError && <p className="mt-6 text-red-600">Unable to load the appointment.</p>}{!isLoading && !isError && !appointment && <p className="mt-6 text-slate-500">Appointment not found.</p>}{appointment && <article className="mt-6 max-w-2xl rounded-xl bg-white p-6 shadow"><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-bold">Appointment details</h1><p className="mt-2 text-lg">Dr. {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}</p><p className="text-slate-500">{appointment.doctor?.specialization}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm capitalize">{appointment.status}</span></div><dl className="mt-6 grid gap-5 sm:grid-cols-2"><div><dt className="text-sm text-slate-500">Date & time</dt><dd className="mt-1 font-medium">{new Date(appointment.appointmentStart).toLocaleString()}</dd></div><div><dt className="text-sm text-slate-500">Hospital</dt><dd className="mt-1 font-medium">{appointment.doctor?.hospital || "Not provided"}</dd></div><div><dt className="text-sm text-slate-500">Consultation fee</dt><dd className="mt-1 font-medium">{appointment.doctor?.consultationFee ?? "Not provided"}</dd></div><div><dt className="text-sm text-slate-500">Reason for visit</dt><dd className="mt-1 font-medium">{appointment.reason || "Not provided"}</dd></div>{appointment.symptoms?.length > 0 && <div className="sm:col-span-2"><dt className="text-sm text-slate-500">Symptoms</dt><dd className="mt-1 font-medium">{appointment.symptoms.join(", ")}</dd></div>}</dl></article>}</DashboardLayout>;
};

export default AppointmentDetails;
