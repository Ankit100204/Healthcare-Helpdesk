import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Button from "../../../components/common/Button";
import { bookAppointment, getAvailableSlots } from "../services/patientService";
import { useDoctors } from "../hooks/useDoctors";

const today = (() => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
})();

const BookAppointmentModal = ({ onClose }) => {
    const queryClient = useQueryClient();
    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState(today);
    const [slotId, setSlotId] = useState("");
    const [reason, setReason] = useState("");
    const { data: doctorsData, isLoading: doctorsLoading } = useDoctors();
    const { data: slotsData, isFetching: slotsLoading } = useQuery({
        queryKey: ["available-slots", doctorId, date],
        queryFn: () => getAvailableSlots({ doctorId, date }),
        enabled: Boolean(doctorId && date),
    });
    const doctors = doctorsData?.data ?? [];
    const slots = slotsData?.data ?? [];
    const mutation = useMutation({
        mutationFn: bookAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast.success("Appointment booked successfully");
            onClose();
        },
        onError: (error) => toast.error(error.response?.data?.message || "Unable to book appointment"),
    });

    const submit = (event) => {
        event.preventDefault();
        if (!slotId || !reason.trim()) {
            toast.error("Choose a time slot and enter a reason for your visit");
            return;
        }
        mutation.mutate({ slotId, reason: reason.trim() });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-label="Book appointment">
            <form onSubmit={submit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Book an appointment</h2><button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close">✕</button></div>
                <div className="mt-5 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Doctor<select value={doctorId} onChange={(event) => { setDoctorId(event.target.value); setSlotId(""); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" disabled={doctorsLoading}><option value="">{doctorsLoading ? "Loading doctors..." : "Select a doctor"}</option>{doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>Dr. {doctor.user?.firstName} {doctor.user?.lastName} — {doctor.specialization}</option>)}</select></label>
                    <label className="block text-sm font-medium text-slate-700">Date<input type="date" min={today} value={date} onChange={(event) => { setDate(event.target.value); setSlotId(""); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                    {doctorId && <div><p className="mb-2 text-sm font-medium text-slate-700">Available times</p>{slotsLoading ? <p className="text-sm text-slate-500">Loading slots...</p> : slots.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{slots.map((slot) => <button type="button" key={slot._id} onClick={() => setSlotId(slot._id)} className={`rounded-lg border px-3 py-2 text-sm ${slotId === slot._id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 hover:border-blue-400"}`}>{new Date(slot.slotStart).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</button>)}</div> : <p className="text-sm text-slate-500">No open slots for this date.</p>}</div>}
                    <label className="block text-sm font-medium text-slate-700">Reason for visit<textarea value={reason} onChange={(event) => setReason(event.target.value)} rows="3" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Briefly describe your concern" /></label>
                </div>
                <div className="mt-6 flex gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2">Cancel</button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Booking..." : "Book appointment"}</Button></div>
            </form>
        </div>
    );
};

export default BookAppointmentModal;
