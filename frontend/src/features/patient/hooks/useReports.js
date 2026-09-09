import { useQuery } from "@tanstack/react-query";
import { getReports } from "../services/patientService";

export const useReports = () => useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
});
