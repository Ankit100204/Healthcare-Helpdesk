import axiosInstance from "../../../api/axios";

export const getDoctors = async () => {
    const { data } = await axiosInstance.get("/doctors");
    return data;
};

export const deleteDoctor = async (id) => {
    const { data } = await axiosInstance.delete(`/doctors/${id}`);
    return data;
};

export const createDoctor = async (payload) => {
    const { data } = await axiosInstance.post("/doctors", payload);
    return data;
};
