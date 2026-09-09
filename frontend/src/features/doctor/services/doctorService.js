import axiosInstance from "../../../api/axios";

export const getDoctorDashboard = async () => {
    const { data } = await axiosInstance.get("/doctors/dashboard");
    return data;
};

export const getDoctorAppointments = async () => {
    const { data } = await axiosInstance.get("/appointments/doctor");
    return data;
};

export const updateAppointmentStatus = async ({ id, status }) => {
    const { data } = await axiosInstance.put(`/appointments/${id}/status`, { status });
    return data;
};

export const uploadReport = async ({ appointmentId, title, reportType, description, file }) => {
    const formData = new FormData();
    formData.append("appointmentId", appointmentId);
    formData.append("title", title);
    formData.append("reportType", reportType);
    formData.append("description", description);
    formData.append("file", file);
    const { data } = await axiosInstance.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};
