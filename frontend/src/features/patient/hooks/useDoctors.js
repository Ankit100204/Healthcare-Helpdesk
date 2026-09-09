import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "../services/patientService";

export const useDoctors = () => useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
});
