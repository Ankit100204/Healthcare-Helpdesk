import { useMemo, useState } from "react";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import AppointmentCard from "../components/AppointmentCard";
import BookAppointmentModal from "../components/BookAppointmentModal";
import CancelAppointmentModal from "../components/CancelAppointmentModal";
import { useAppointments } from "../hooks/useAppointments";

const initialFilters = { status: "", type: "", from: "", to: "", sort: "asc" };

const Appointments = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState(initialFilters);
    const [search, setSearch] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const params = useMemo(() => ({ page, limit: 10, ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value)) }), [page, filters]);
    const { data, isLoading, isFetching, isError } = useAppointments(params);
    const result = data?.data;
    const appointments = result?.appointments ?? [];
    const visibleAppointments = appointments.filter((appointment) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return [appointment.doctor?.user?.firstName, appointment.doctor?.user?.lastName, appointment.doctor?.specialization, appointment.status, appointment.reason].filter(Boolean).join(" ").toLowerCase().includes(term);
    });
    const updateFilter = (key, value) => { setPage(1); setFilters((current) => ({ ...current, [key]: value })); };
    const clearFilters = () => { setFilters(initialFilters); setSearch(""); setPage(1); };

    return <DashboardLayout><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">My Appointments</h1><p className="mt-1 text-slate-500">Book, review, and manage your appointments.</p></div><button onClick={() => setIsBooking(true)} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Book appointment</button></div><section className="mb-6 rounded-xl bg-white p-4 shadow"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this page" className="rounded-lg border border-slate-300 px-3 py-2 xl:col-span-2" /><select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2"><option value="">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><select value={filters.type} onChange={(event) => updateFilter("type", event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2"><option value="">All dates</option><option value="upcoming">Upcoming</option><option value="past">Past</option></select><select value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2"><option value="asc">Oldest first</option><option value="desc">Newest first</option></select><button onClick={clearFilters} className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-50">Clear filters</button></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-sm text-slate-600">From<input type="date" value={filters.from} onChange={(event) => updateFilter("from", event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="text-sm text-slate-600">To<input type="date" value={filters.to} onChange={(event) => updateFilter("to", event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" /></label></div></section>{isLoading && <p>Loading appointments...</p>}{isError && <p className="text-red-600">Unable to load appointments.</p>}{!isLoading && !isError && <><div className="mb-3 text-sm text-slate-500">{isFetching ? "Updating…" : `${result?.total ?? 0} appointment${result?.total === 1 ? "" : "s"} found`}</div><div className="grid gap-5">{visibleAppointments.map((appointment) => <AppointmentCard key={appointment._id} appointment={appointment} onCancel={setAppointmentToCancel} />)}{!visibleAppointments.length && <p className="rounded-xl bg-white p-5 text-slate-500 shadow">No appointments match your search or filters.</p>}</div>{result?.totalPages > 1 && <nav className="mt-6 flex items-center justify-between" aria-label="Appointment pagination"><button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-lg border border-slate-300 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">Previous</button><span className="text-sm text-slate-600">Page {result.page} of {result.totalPages}</span><button onClick={() => setPage((current) => Math.min(result.totalPages, current + 1))} disabled={page === result.totalPages} className="rounded-lg border border-slate-300 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">Next</button></nav>}</>}{isBooking && <BookAppointmentModal onClose={() => setIsBooking(false)} />}{appointmentToCancel && <CancelAppointmentModal appointment={appointmentToCancel} onClose={() => setAppointmentToCancel(null)} />}</DashboardLayout>;
};

export default Appointments;
