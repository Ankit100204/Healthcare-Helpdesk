import axiosInstance from "../../../api/axios";

export const login = async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
};

export const register = async (data) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
};

export const logout = async () => {
    await axiosInstance.post("/auth/logout");
};

export const changePassword = async (payload) => {
    const response = await axiosInstance.put("/auth/change-password", payload);
    return response.data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post("/files/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
