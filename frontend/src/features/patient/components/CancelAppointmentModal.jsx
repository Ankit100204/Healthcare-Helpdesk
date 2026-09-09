import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Button from "../../../components/common/Button";
import { cancelAppointment } from "../services/patientService";

const CancelAppointmentModal = ({ appointment, onClose }) => {
    const [reason, setReason] = useState("");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: cancelAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast.success("Appointment cancelled");
            onClose();
        },
        onError: (error) => toast.error(error.response?.data?.message || "Unable to cancel appointment"),
    });
    const submit = (event) => {
        event.preventDefault();
        if (!reason.trim()) {
            toast.error("Please provide a cancellation reason");
            return;
        }
        mutation.mutate({ id: appointment._id, reason: reason.trim() });
    };

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-label="Cancel appointment"><form onSubmit={submit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h2 className="text-xl font-bold">Cancel appointment</h2><p className="mt-2 text-slate-600">Are you sure you want to cancel your appointment with Dr. {appointment.doctor?.user?.firstName}?</p><label className="mt-5 block text-sm font-medium text-slate-700">Reason<textarea required value={reason} onChange={(event) => setReason(event.target.value)} rows="3" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Tell us why you are cancelling" /></label><div className="mt-6 flex gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2">Keep appointment</button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Cancelling..." : "Cancel appointment"}</Button></div></form></div>;
};

export default CancelAppointmentModal;
