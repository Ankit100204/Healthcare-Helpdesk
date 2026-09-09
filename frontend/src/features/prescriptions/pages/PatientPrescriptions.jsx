import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getMyPrescriptions } from "../services/prescriptionService";
import { Eye, Pill } from "lucide-react";

const PatientPrescriptions = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["patient-prescriptions"],
        queryFn: getMyPrescriptions,
    });
    const prescriptions = data?.data?.data ?? [];
    const [viewing, setViewing] = useState(null);

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">My Prescriptions</h1>

            {isLoading && <p>Loading prescriptions...</p>}
            {isError && <p className="text-red-600">Unable to load prescriptions.</p>}

            {!isLoading && !isError && (
                <div className="space-y-4">
                    {prescriptions.length === 0 ? (
                        <p className="text-slate-500">No prescriptions yet.</p>
                    ) : (
                        prescriptions.map((prescription) => (
                            <div key={prescription._id} className="rounded-xl bg-white p-5 shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-lg bg-emerald-100 p-3">
                                            <Pill className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{prescription.diagnosis}</h3>
                                            <p className="text-sm text-slate-500">
                                                Dr. {prescription.doctor?.user?.firstName}{" "}
                                                {prescription.doctor?.user?.lastName} ·{" "}
                                                {new Date(prescription.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {prescription.medicines?.length} medicine(s) ·{" "}
                                                <span className="capitalize">{prescription.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setViewing(prescription)}
                                        className="rounded-lg border p-2 hover:bg-slate-50"
                                        title="View details"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>
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
                            <p className="text-sm text-slate-500">Prescribed by</p>
                            <p className="font-medium">
                                Dr. {viewing.doctor?.user?.firstName} {viewing.doctor?.user?.lastName} · {viewing.doctor?.user?.email}
                            </p>
                            <p className="mt-2 text-sm text-slate-500">Date</p>
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

export default PatientPrescriptions;
