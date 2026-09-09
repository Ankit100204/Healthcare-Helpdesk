import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Button from "../../../components/common/Button";
import axiosInstance from "../../../api/axios";

const generateSlots = async (payload) => {
    const { data } = await axiosInstance.post("/slots/my/generate", payload);
    return data;
};

const getSlots = async (date) => {
    const { data } = await axiosInstance.get("/slots/my", { params: { date } });
    return data;
};

const today = (() => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
})();

const DoctorSlots = () => {
    const queryClient = useQueryClient();
    const [date, setDate] = useState(today);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [duration, setDuration] = useState(30);

    const slotsQuery = useQuery({ queryKey: ["doctor-slots", date], queryFn: () => getSlots(date), enabled: Boolean(date) });
    const slots = slotsQuery.data?.data ?? [];

    const mutation = useMutation({
        mutationFn: generateSlots,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["doctor-slots"] });
            toast.success(`${response.data?.inserted || 0} slots generated`);
        },
        onError: (error) => toast.error(error.response?.data?.message || "Unable to generate slots"),
    });

    const submit = (event) => {
        event.preventDefault();
        mutation.mutate({ date, startTime, endTime, slotDuration: duration });
    };

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">Manage Slots</h1>
            <form onSubmit={submit} className="mb-8 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold">Generate appointment slots</h2>
                <div className="grid gap-4 md:grid-cols-4">
                    <label className="text-sm font-medium text-slate-700">
                        Date
                        <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                    </label>
                    <label className="text-sm font-medium text-slate-700">
                        Start time
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                    </label>
                    <label className="text-sm font-medium text-slate-700">
                        End time
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                    </label>
                    <label className="text-sm font-medium text-slate-700">
                        Duration (min)
                        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                            <option value={15}>15 min</option>
                            <option value={30}>30 min</option>
                            <option value={45}>45 min</option>
                            <option value={60}>60 min</option>
                        </select>
                    </label>
                </div>
                <Button type="submit" disabled={mutation.isPending} className="mt-4">{mutation.isPending ? "Generating..." : "Generate slots"}</Button>
            </form>

            <div className="rounded-xl bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold">Slots for {new Date(date).toDateString()}</h2>
                {slotsQuery.isLoading && <p>Loading slots...</p>}
                {slotsQuery.isError && <p className="text-red-600">Unable to load slots.</p>}
                {!slotsQuery.isLoading && !slotsQuery.isError && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {slots.map((slot) => (
                            <div key={slot._id} className={`rounded-lg border p-3 text-center ${slot.isBooked ? "border-red-300 bg-red-50 text-red-600" : "border-green-300 bg-green-50 text-green-700"}`}>
                                <p className="text-sm font-medium">{new Date(slot.slotStart).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
                                <p className="mt-1 text-xs">{slot.isBooked ? "Booked" : "Available"}</p>
                            </div>
                        ))}
                        {slots.length === 0 && <p className="col-span-full text-slate-500">No slots for this date.</p>}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DoctorSlots;
