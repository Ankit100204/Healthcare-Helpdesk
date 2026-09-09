import { Home, CalendarDays, User, FileText, Bell, Clock, Users, Stethoscope, ChartNoAxesColumn, Pill } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
    const { user } = useAuth();
    return (
        <aside className="w-64 bg-white shadow min-h-[calc(100vh-64px)] p-4">
            {user?.role === "patient" && (
                <>
                    <SidebarItem to="/patient" icon={<Home size={18} />} label="Dashboard" />
                    <SidebarItem to="/patient/appointments" icon={<CalendarDays size={18} />} label="Appointments" />
                    <SidebarItem to="/patient/reports" icon={<FileText size={18} />} label="Medical Reports" />
                    <SidebarItem to="/patient/prescriptions" icon={<Pill size={18} />} label="Prescriptions" />
                    <SidebarItem to="/patient/profile" icon={<User size={18} />} label="Profile" />
                    <SidebarItem to="/notifications" icon={<Bell size={18} />} label="Notifications" />
                </>
            )}
            {user?.role === "doctor" && (
                <>
                    <SidebarItem to="/doctor" icon={<Home size={18} />} label="Dashboard" />
                    <SidebarItem to="/doctor/appointments" icon={<CalendarDays size={18} />} label="Appointments" />
                    <SidebarItem to="/doctor/patients" icon={<Users size={18} />} label="Patient Details" />
                    <SidebarItem to="/doctor/slots" icon={<Clock size={18} />} label="Manage Slots" />
                    <SidebarItem to="/doctor/reports" icon={<FileText size={18} />} label="Reports" />
                    <SidebarItem to="/doctor/prescriptions" icon={<Pill size={18} />} label="Prescriptions" />
                    <SidebarItem to="/doctor/profile" icon={<User size={18} />} label="Profile" />
                    <SidebarItem to="/notifications" icon={<Bell size={18} />} label="Notifications" />
                </>
            )}
            {user?.role === "admin" && (
                <>
                    <SidebarItem to="/admin" icon={<Home size={18} />} label="Dashboard" />
                    <SidebarItem to="/admin/doctors" icon={<Stethoscope size={18} />} label="Manage Doctors" />
                    <SidebarItem to="/admin/patients" icon={<Users size={18} />} label="Manage Patients" />
                    <SidebarItem to="/admin/analytics" icon={<ChartNoAxesColumn size={18} />} label="Analytics" />
                    <SidebarItem to="/admin/reports" icon={<FileText size={18} />} label="Reports" />
                    <SidebarItem to="/admin/prescriptions" icon={<Pill size={18} />} label="Prescriptions" />
                    <SidebarItem to="/notifications" icon={<Bell size={18} />} label="Notifications" />
                </>
            )}
        </aside>
    );
};

export default Sidebar;
