import { useQuery } from "@tanstack/react-query";
import { Users, Stethoscope, CalendarDays, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import StatCard from "../../../components/common/StatCard";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import axiosInstance from "../../../api/axios";

const AdminAnalytics = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-analytics"],
        queryFn: () => axiosInstance.get("/admin/analytics").then((r) => r.data),
    });

    const summary = data?.data?.summary ?? {};
    const recentAppointments = data?.data?.recentAppointments ?? [];

    const stats = [
        { icon: <Stethoscope className="h-6 w-6" />, label: "Total Doctors", value: summary.totalDoctors ?? 0 },
        { icon: <Users className="h-6 w-6" />, label: "Total Patients", value: summary.totalPatients ?? 0 },
        { icon: <CalendarDays className="h-6 w-6" />, label: "Total Appointments", value: summary.totalAppointments ?? 0 },
        { icon: <FileText className="h-6 w-6" />, label: "Medical Reports", value: summary.totalReports ?? 0 },
    ];

    const statusStats = [
        { icon: <Clock className="h-6 w-6" />, label: "Pending", value: summary.pendingAppointments ?? 0 },
        { icon: <CheckCircle2 className="h-6 w-6" />, label: "Completed", value: summary.completedAppointments ?? 0 },
        { icon: <XCircle className="h-6 w-6" />, label: "Cancelled", value: summary.cancelledAppointments ?? 0 },
    ];

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">Analytics</h1>

            {isLoading && <p className="text-slate-500">Loading analytics...</p>}

            {isError && (
                <p className="text-red-600">Unable to load analytics. Please try again later.</p>
            )}

            {!isLoading && !isError && (
                <>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((s) => (
                            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} />
                        ))}
                    </div>

                    <h2 className="mt-10 mb-4 text-xl font-semibold">Appointment Status</h2>
                    <div className="grid gap-5 md:grid-cols-3">
                        {statusStats.map((s) => (
                            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} />
                        ))}
                    </div>

                    <h2 className="mt-10 mb-4 text-xl font-semibold">Recent Appointments</h2>
                    <div className="overflow-x-auto rounded-xl bg-white p-6 shadow">
                        {recentAppointments.length === 0 ? (
                            <p className="text-slate-500">No recent appointments.</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-3 font-medium">Patient</th>
                                        <th className="pb-3 font-medium">Doctor</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentAppointments.map((a) => (
                                        <tr key={a._id} className="hover:bg-slate-50">
                                            <td className="py-3">
                                                {a.patient?.user ? `${a.patient.user.firstName} ${a.patient.user.lastName}` : "—"}
                                            </td>
                                            <td className="py-3">
                                                {a.doctor?.user ? `Dr. ${a.doctor.user.firstName} ${a.doctor.user.lastName}` : "—"}
                                            </td>
                                            <td className="py-3 capitalize">{a.status || "—"}</td>
                                            <td className="py-3">
                                                {a.appointmentStart ? new Date(a.appointmentStart).toLocaleString() : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default AdminAnalytics;
