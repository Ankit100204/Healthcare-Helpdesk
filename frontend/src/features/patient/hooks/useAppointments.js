import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../services/patientService";

export const useAppointments = (params = {}) => {
    return useQuery({
        queryKey: ["appointments", params],
        queryFn: () => getAppointments(params),
        placeholderData: (previousData) => previousData,
    });
};

