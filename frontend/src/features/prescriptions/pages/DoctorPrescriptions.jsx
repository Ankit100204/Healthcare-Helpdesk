import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Button from "../../../components/common/Button";
import {
    getDoctorPrescriptions,
    createPrescription,
    updatePrescription,
    deletePrescription,
    getCompletedAppointments,
} from "../services/prescriptionService";
import { Plus, Trash2, Eye, Pill } from "lucide-react";

const FREQUENCIES = [
    "Once Daily",
    "Twice Daily",
    "Thrice Daily",
    "Every 4 Hours",
    "Every 6 Hours",
    "Every 8 Hours",
    "Every 12 Hours",
    "As Needed",
];

const emptyMedicine = {
    medicineName: "",
    dosage: "",
    frequency: FREQUENCIES[0],
    duration: "",
    instructions: "",
};

const DoctorPrescriptions = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);

    // Form state
    const [appointmentId, setAppointmentId] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");
    const [followUpDate, setFollowUpDate] = useState("");
    const [followUpNotes, setFollowUpNotes] = useState("");
    const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);

    const { data, isLoading } = useQuery({
        queryKey: ["doctor-prescriptions"],
        queryFn: getDoctorPrescriptions,
    });

    const { data: appointmentsData } = useQuery({
        queryKey: ["doctor-completed-appointments"],
        queryFn: getCompletedAppointments,
    });

    const prescriptions = data?.data?.data ?? [];
    const completedAppointments = appointmentsData?.data?.appointments ?? [];

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["doctor-prescriptions"] });
        queryClient.invalidateQueries({ queryKey: ["doctor-completed-appointments"] });
    };

    const resetForm = () => {
        setAppointmentId("");
        setDiagnosis("");
        setNotes("");
        setFollowUpDate("");
        setFollowUpNotes("");
        setMedicines([{ ...emptyMedicine }]);
    };

    const createMutation = useMutation({
        mutationFn: createPrescription,
        onSuccess: () => {
            toast.success("Prescription created successfully");
            invalidate();
            setShowForm(false);
            resetForm();
        },
        onError: (err) => toast.error(err.response?.data?.message || "Unable to create prescription"),
    });

    const updateMutation = useMutation({
        mutationFn: updatePrescription,
        onSuccess: () => {
            toast.success("Prescription updated successfully");
            invalidate();
            setShowForm(false);
            setEditing(null);
            resetForm();
        },
        onError: (err) => toast.error(err.response?.data?.message || "Unable to update prescription"),
    });

    const deleteMutation = useMutation({
        mutationFn: deletePrescription,
        onSuccess: () => {
            toast.success("Prescription deleted");
            invalidate();
        },
        onError: (err) => toast.error(err.response?.data?.message || "Unable to delete prescription"),
    });

    const updateMedicine = (index, field, value) => {
        setMedicines((prev) =>
            prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
        );
    };

    const addMedicine = () => setMedicines((prev) => [...prev, { ...emptyMedicine }]);
    const removeMedicine = (index) =>
        setMedicines((prev) => prev.filter((_, i) => i !== index));

    const openEdit = (prescription) => {
        setEditing(prescription);
        setAppointmentId(prescription.appointment?._id || "");
        setDiagnosis(prescription.diagnosis || "");
        setNotes(prescription.notes || "");
        setFollowUpDate(
            prescription.followUpDate
                ? prescription.followUpDate.slice(0, 10)
                : ""
        );
        setFollowUpNotes(prescription.followUpNotes || "");
        setMedicines(
            prescription.medicines?.length
                ? prescription.medicines.map((m) => ({ ...m }))
                : [{ ...emptyMedicine }]
        );
        setShowForm(true);
    };

    const submit = (event) => {
        event.preventDefault();
        if (!appointmentId || !diagnosis.trim()) {
            toast.error("Please select an appointment and enter a diagnosis");
            return;
        }
        if (medicines.length === 0 || medicines.some((m) => !m.medicineName.trim() || !m.dosage.trim() || !m.duration.trim())) {
            toast.error("Each medicine needs a name, dosage and duration");
            return;
        }
        const payload = {
            appointmentId,
            diagnosis: diagnosis.trim(),
            notes: notes.trim(),
            followUpDate: followUpDate || undefined,
            followUpNotes: followUpNotes.trim(),
            medicines: medicines.map((m) => ({
                medicineName: m.medicineName.trim(),
                dosage: m.dosage.trim(),
                frequency: m.frequency,
                duration: m.duration.trim(),
                instructions: m.instructions?.trim() || "",
            })),
        };
        if (editing) {
            updateMutation.mutate({ id: editing._id, ...payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="mb-1 text-3xl font-bold">Prescriptions</h1>
                    <p className="text-slate-500">Create and manage prescriptions for your patients.</p>
                </div>
                <button
                    onClick={() => { setShowForm((v) => !v); setEditing(null); resetForm(); }}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    New prescription
                </button>
            </div>

            {showForm && (
                <form onSubmit={submit} className="mb-8 rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold">
                        {editing ? "Edit prescription" : "Create new prescription"}
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700">
                            Completed appointment
                            <select
                                value={appointmentId}
                                onChange={(e) => setAppointmentId(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                required
                                disabled={!!editing}
                            >
                                <option value="">Select an appointment</option>
                                {completedAppointments.map((appointment) => (
                                    <option key={appointment._id} value={appointment._id}>
                                        {appointment.patient?.user?.firstName}{" "}
                                        {appointment.patient?.user?.lastName} —{" "}
                                        {new Date(appointment.appointmentStart).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-sm font-medium text-slate-700">
                            Follow-up date (optional)
                            <input
                                type="date"
                                value={followUpDate}
                                onChange={(e) => setFollowUpDate(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <label className="text-sm font-medium text-slate-700 md:col-span-2">
                            Diagnosis *
                            <input
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                placeholder="e.g. Acute bronchitis"
                                required
                            />
                        </label>

                        <label className="text-sm font-medium text-slate-700 md:col-span-2">
                            Notes (optional)
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                placeholder="Additional notes for the patient"
                            />
                        </label>
                    </div>

                    <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-semibold">Medicines</h3>
                            <button
                                type="button"
                                onClick={addMedicine}
                                className="rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                            >
                                + Add medicine
                            </button>
                        </div>

                        <div className="space-y-4">
                            {medicines.map((medicine, index) => (
                                <div key={index} className="rounded-lg border border-slate-200 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-500">Medicine {index + 1}</span>
                                        {medicines.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMedicine(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <label className="text-sm font-medium text-slate-700">
                                            Name *
                                            <input
                                                value={medicine.medicineName}
                                                onChange={(e) => updateMedicine(index, "medicineName", e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                                placeholder="e.g. Paracetamol"
                                                required
                                            />
                                        </label>
                                        <label className="text-sm font-medium text-slate-700">
                                            Dosage *
                                            <input
                                                value={medicine.dosage}
                                                onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                                placeholder="e.g. 500mg"
                                                required
                                            />
                                        </label>
                                        <label className="text-sm font-medium text-slate-700">
                                            Frequency *
                                            <select
                                                value={medicine.frequency}
                                                onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                            >
                                                {FREQUENCIES.map((freq) => (
                                                    <option key={freq} value={freq}>{freq}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="text-sm font-medium text-slate-700">
                                            Duration *
                                            <input
                                                value={medicine.duration}
                                                onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                                placeholder="e.g. 5 days"
                                                required
                                            />
                                        </label>
                                        <label className="text-sm font-medium text-slate-700 lg:col-span-2">
                                            Instructions (optional)
                                            <input
                                                value={medicine.instructions}
                                                onChange={(e) => updateMedicine(index, "instructions", e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                                placeholder="e.g. Take after meals"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <label className="mt-6 block text-sm font-medium text-slate-700">
                        Follow-up notes (optional)
                        <textarea
                            value={followUpNotes}
                            onChange={(e) => setFollowUpNotes(e.target.value)}
                            rows={2}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            placeholder="Instructions for the follow-up visit"
                        />
                    </label>

                    <div className="mt-4 flex gap-3">
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="max-w-xs">
                            {createMutation.isPending || updateMutation.isPending
                                ? "Saving..."
                                : editing ? "Update prescription" : "Create prescription"}
                        </Button>
                        <button
                            type="button"
                            onClick={() => { setShowForm(false); setEditing(null); resetForm(); }}
                            className="rounded-lg border border-slate-300 px-4 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {isLoading && <p>Loading prescriptions...</p>}

            {!isLoading && (
                <div className="space-y-4">
                    {prescriptions.length === 0 ? (
                        <p className="text-slate-500">No prescriptions written yet.</p>
                    ) : (
                        prescriptions.map((prescription) => (
                            <div key={prescription._id} className="rounded-xl bg-white p-5 shadow">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-lg bg-emerald-100 p-3">
                                            <Pill className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{prescription.diagnosis}</h3>
                                            <p className="text-sm text-slate-500">
                                                Patient: {prescription.patient?.user?.firstName}{" "}
                                                {prescription.patient?.user?.lastName} ·{" "}
                                                {new Date(prescription.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {prescription.medicines?.length} medicine(s) ·{" "}
                                                <span className="capitalize">{prescription.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setViewing(prescription)}
                                            className="rounded-lg border p-2 hover:bg-slate-50"
                                            title="View"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => openEdit(prescription)}
                                            className="rounded-lg border px-3 py-2 text-sm text-blue-600 hover:bg-slate-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Delete this prescription?")) {
                                                    deleteMutation.mutate(prescription._id);
                                                }
                                            }}
                                            className="rounded-lg border p-2 text-red-500 hover:bg-slate-50"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {viewing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Prescription details</h2>
                            <button onClick={() => setViewing(null)} className="text-slate-500">Close</button>
                        </div>
                        <div className="mb-4 rounded-lg bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Patient</p>
                            <p className="font-medium">
                                {viewing.patient?.user?.firstName} {viewing.patient?.user?.lastName} · {viewing.patient?.user?.email}
                            </p>
                            <p className="mt-2 text-sm text-slate-500">Created</p>
                            <p className="font-medium">{new Date(viewing.createdAt).toLocaleString()}</p>
                        </div>
                        <h3 className="font-semibold">Diagnosis</h3>
                        <p className="mb-2 text-slate-700">{viewing.diagnosis}</p>
                        {viewing.notes && <p className="mb-4 text-slate-600">Notes: {viewing.notes}</p>}

                        <h3 className="mb-2 font-semibold">Medicines</h3>
                        <div className="space-y-2">
                            {viewing.medicines?.map((medicine, index) => (
                                <div key={index} className="rounded-lg border border-slate-200 p-3">
                                    <p className="font-medium">{medicine.medicineName} — {medicine.dosage}</p>
                                    <p className="text-sm text-slate-500">
                                        {medicine.frequency} · {medicine.duration}
                                    </p>
                                    {medicine.instructions && (
                                        <p className="text-sm text-slate-600">Instructions: {medicine.instructions}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {viewing.followUpDate && (
                            <div className="mt-4 rounded-lg bg-blue-50 p-4">
                                <p className="font-medium">Follow-up: {new Date(viewing.followUpDate).toLocaleDateString()}</p>
                                {viewing.followUpNotes && <p className="mt-1 text-sm text-slate-600">{viewing.followUpNotes}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default DoctorPrescriptions;
