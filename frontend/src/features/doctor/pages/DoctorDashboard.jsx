import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StatCard from "../../../components/common/StatCard";
import { getDoctorDashboard } from "../services/doctorService";

const DoctorDashboard = () => {
    const { data, isLoading, isError } = useQuery({ queryKey: ["doctor-dashboard"], queryFn: getDoctorDashboard });
    const summary = data?.data?.summary;

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">Doctor Dashboard</h1>
            {isLoading && <p>Loading dashboard...</p>}
            {isError && <p className="text-red-600">Unable to load dashboard data.</p>}
            {summary && <><div className="grid gap-6 md:grid-cols-3"><StatCard title="Today" value={summary.todayAppointments} /><StatCard title="Pending" value={summary.pendingAppointments} /><StatCard title="Upcoming" value={summary.upcomingAppointments} /><StatCard title="Confirmed" value={summary.confirmedAppointments} /><StatCard title="Completed" value={summary.completedAppointments} /><StatCard title="Cancelled" value={summary.cancelledAppointments} /></div><p className="mt-6 text-slate-500">Manage appointments from the Appointments section.</p></>}
        </DashboardLayout>
    );
};

export default DoctorDashboard;
