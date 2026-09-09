import axiosInstance from "../../../api/axios";

export const getMyPrescriptions = () =>
    axiosInstance.get("/prescriptions/my").then((r) => r.data);

export const getDoctorPrescriptions = () =>
    axiosInstance.get("/prescriptions/doctor").then((r) => r.data);

export const getAllPrescriptions = () =>
    axiosInstance.get("/prescriptions/all").then((r) => r.data);

export const getPrescriptionById = (id) =>
    axiosInstance.get(`/prescriptions/${id}`).then((r) => r.data);

export const createPrescription = (payload) =>
    axiosInstance.post("/prescriptions", payload).then((r) => r.data);

export const updatePrescription = ({ id, ...payload }) =>
    axiosInstance.put(`/prescriptions/${id}`, payload).then((r) => r.data);

export const deletePrescription = (id) =>
    axiosInstance.delete(`/prescriptions/${id}`).then((r) => r.data);

export const getCompletedAppointments = () =>
    axiosInstance
        .get("/appointments/doctor", { params: { status: "completed", limit: 100 } })
        .then((r) => r.data);
