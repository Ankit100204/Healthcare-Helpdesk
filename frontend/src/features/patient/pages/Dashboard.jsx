import DashboardLayout from "../../../components/layout/DashboardLayout";
import StatCard from "../../../components/common/StatCard";
import { useQuery } from "@tanstack/react-query";
import { getAppointments, getReports } from "../services/patientService";

const PatientDashboard = () => {
    const { data: appointmentsData } = useQuery({ queryKey: ["appointments", "dashboard"], queryFn: () => getAppointments({ limit: 100 }) });
    const { data: reportsData } = useQuery({ queryKey: ["reports", "dashboard"], queryFn: getReports });
    const appointments = appointmentsData?.data?.appointments ?? [];
    const reports = reportsData?.data?.total ?? 0;
    const upcoming = appointments.filter((appointment) => new Date(appointment.appointmentStart) >= new Date() && appointment.status !== "cancelled").length;
    return (
        <DashboardLayout>

            <h1 className="mb-6 text-3xl font-bold">
                Patient Dashboard
            </h1>

            <div className="grid gap-6 md:grid-cols-3">

                <StatCard
                    title="Appointments"
                    value={appointmentsData?.data?.total ?? 0}
                />

                <StatCard
                    title="Reports"
                    value={reports}
                />

                <StatCard
                    title="Upcoming"
                    value={upcoming}
                />

            </div>

        </DashboardLayout>
    );
};

export default PatientDashboard;
