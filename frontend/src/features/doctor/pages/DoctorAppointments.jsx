import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getDoctorAppointments, updateAppointmentStatus } from "../services/doctorService";

const statuses = ["confirmed", "in_progress", "completed", "rejected"];

const DoctorAppointments = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({ queryKey: ["doctor-appointments"], queryFn: getDoctorAppointments });
    const mutation = useMutation({
        mutationFn: updateAppointmentStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
            queryClient.invalidateQueries({ queryKey: ["doctor-dashboard"] });
            toast.success("Appointment status updated");
        },
        onError: (error) => toast.error(error.response?.data?.message || "Unable to update status"),
    });
    const appointments = data?.data?.appointments ?? [];

    return <DashboardLayout><h1 className="mb-6 text-3xl font-bold">Appointments</h1>{isLoading && <p>Loading appointments...</p>}{isError && <p className="text-red-600">Unable to load appointments.</p>}<div className="space-y-4">{appointments.map((appointment) => <article key={appointment._id} className="rounded-xl bg-white p-5 shadow"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-semibold">{appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}</h2><p className="text-sm text-slate-500">{appointment.patient?.user?.phone} · {new Date(appointment.appointmentStart).toLocaleString()}</p>{appointment.reason && <p className="mt-2 text-slate-600">{appointment.reason}</p>}</div><div className="flex items-center gap-3"><span className="capitalize text-slate-600">{appointment.status}</span>{["completed", "cancelled", "rejected"].includes(appointment.status) ? null : <select value="" onChange={(event) => event.target.value && mutation.mutate({ id: appointment._id, status: event.target.value })} disabled={mutation.isPending} className="rounded-lg border border-slate-300 px-3 py-2"><option value="">Update status</option>{statuses.filter((status) => status !== appointment.status).map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select>}</div></div></article>)}{!isLoading && !appointments.length && <p className="text-slate-500">No appointments found.</p>}</div></DashboardLayout>;
};

export default DoctorAppointments;
