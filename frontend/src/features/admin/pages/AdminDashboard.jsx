import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StatCard from "../../../components/common/StatCard";
import { getDoctors } from "../services/adminService";

const AdminDashboard = () => {
    const { data, isLoading, isError } = useQuery({ queryKey: ["admin-doctors"], queryFn: getDoctors });
    const doctors = data?.data ?? [];
    return <DashboardLayout><h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>{isLoading && <p>Loading dashboard...</p>}{isError && <p className="text-red-600">Unable to load dashboard data.</p>}{!isLoading && !isError && <div className="grid gap-6 md:grid-cols-3"><StatCard title="Doctors" value={doctors.length} /><StatCard title="Hospitals" value={new Set(doctors.map((doctor) => doctor.hospital).filter(Boolean)).size} /><StatCard title="Specializations" value={new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean)).size} /></div>}</DashboardLayout>;
};

export default AdminDashboard;
