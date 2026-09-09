import axiosInstance from "../../../api/axios";

export const getDashboardStats = async () => {
    const { data } = await axiosInstance.get("/appointments/my", {
        params: { limit: 1 },
    });
    return data;
};

export const getAppointments = async (params = {}) => {
    const { data } = await axiosInstance.get("/appointments/my", {
        params,
    });
    return data;
};

export const bookAppointment = async (payload) => {
    const { data } = await axiosInstance.post(
        "/appointments",
        payload
    );
    return data;
};

export const cancelAppointment = async ({ id, reason }) => {
    const { data } = await axiosInstance.put(
        `/appointments/${id}/cancel`,
        { reason }
    );
    return data;
};

export const getReports = async () => {
    const { data } = await axiosInstance.get("/reports/my");
    return data;
};

export const getDoctors = async () => {
    const { data } = await axiosInstance.get("/doctors/search");
    return data;
};

export const getAvailableSlots = async ({ doctorId, date }) => {
    const { data } = await axiosInstance.get(`/slots/doctor/${doctorId}`, {
        params: { date },
    });
    return data;
};

export const getPatientProfile = async () => {
    const { data } = await axiosInstance.get("/patients/profile");
    return data;
};

export const updatePatientProfile = async (payload) => {
    const { data } = await axiosInstance.put("/patients/profile", payload);
    return data;
};
