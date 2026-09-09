import { Routes, Route ,Navigate} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Home from "../pages/Home";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import NotFound from "../pages/NotFound";

// Patient
import PatientDashboard from "../features/patient/pages/Dashboard";
import Appointments from "../features/patient/pages/Appointments";
import AppointmentDetails from "../features/patient/pages/AppointmentDetails";
import Profile from "../features/patient/pages/Profile";
import Reports from "../features/patient/pages/Reports";

// Doctor
import DoctorDashboard from "../features/doctor/pages/DoctorDashboard";
import DoctorAppointments from "../features/doctor/pages/DoctorAppointments";
import DoctorPatients from "../features/doctor/pages/DoctorPatients";
import DoctorSlots from "../features/doctor/pages/DoctorSlots";
import DoctorReports from "../features/doctor/pages/DoctorReports";
import DoctorProfile from "../features/doctor/pages/DoctorProfile";

// Admin
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import Doctors from "../features/admin/pages/Doctors";
import AdminPatients from "../features/admin/pages/AdminPatients";
import AdminAnalytics from "../features/admin/pages/AdminAnalytics";
import AdminReports from "../features/admin/pages/AdminReports";

// Prescriptions
import PatientPrescriptions from "../features/prescriptions/pages/PatientPrescriptions";
import DoctorPrescriptions from "../features/prescriptions/pages/DoctorPrescriptions";
import AdminPrescriptions from "../features/prescriptions/pages/AdminPrescriptions";

// Shared
import Notifications from "../features/notifications/pages/Notifications";

const AppRoutes = () => {
    return (
        <Routes>

            <Route
                path="/"
                element={<Navigate to="/auth/login" replace />}
            />
            <Route path="auth/login" element={<Login />} />
            <Route path="auth/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>

                <Route
                    element={
                        <RoleRoute allowedRoles={["patient"]} />
                    }
                >
                    <Route path="/patient" element={<PatientDashboard />} />
                    <Route path="/patient/appointments" element={<Appointments />} />
                    <Route path="/patient/appointments/:id" element={<AppointmentDetails />} />
                    <Route path="/patient/profile" element={<Profile />} />
                    <Route path="/patient/reports" element={<Reports />} />
                    <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
                </Route>

                <Route
                    element={
                        <RoleRoute allowedRoles={["doctor"]} />
                    }
                >
                    <Route path="/doctor" element={<DoctorDashboard />} />
                    <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                    <Route path="/doctor/patients" element={<DoctorPatients />} />
                    <Route path="/doctor/slots" element={<DoctorSlots />} />
                    <Route path="/doctor/reports" element={<DoctorReports />} />
                    <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
                    <Route path="/doctor/profile" element={<DoctorProfile />} />
                </Route>

                <Route
                    element={
                        <RoleRoute allowedRoles={["admin"]} />
                    }
                >
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/doctors" element={<Doctors />} />
                    <Route path="/admin/patients" element={<AdminPatients />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/reports" element={<AdminReports />} />
                    <Route path="/admin/prescriptions" element={<AdminPrescriptions />} />
                </Route>

                {/* Shared notification route (accessible to all roles) */}
                <Route path="/notifications" element={<Notifications />} />

            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
};

export default AppRoutes;
